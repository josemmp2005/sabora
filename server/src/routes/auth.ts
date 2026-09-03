import { Router } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { pool, withTransaction } from '../db.js';
import { requireAuth, signSessionToken, SESSION_COOKIE } from '../middleware/auth.js';
import { isProd, env } from '../env.js';
import { sendMail } from '../lib/mailer.js';

const router = Router();

const PASSWORD_MIN_LENGTH = 6;
const RESET_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 min

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const toPublicUser = (row: { id: string; email: string; username: string; avatar_url: string | null }) => ({
  id: row.id,
  email: row.email,
  username: row.username,
  avatar_url: row.avatar_url,
});

router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body ?? {};

  if (typeof email !== 'string' || typeof password !== 'string' || typeof username !== 'string' || !username.trim()) {
    return res.status(400).json({ error: 'Faltan campos: email, password, username' });
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return res.status(400).json({ error: `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres` });
  }

  const normalizedEmail = normalizeEmail(email);

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await withTransaction(async (client) => {
      const { rows } = await client.query(
        `INSERT INTO users (email, password_hash, username)
         VALUES ($1, $2, $3)
         RETURNING id, email, username, avatar_url`,
        [normalizedEmail, passwordHash, username.trim()]
      );
      const newUser = rows[0];

      await client.query(
        `INSERT INTO subscriptions (user_id, plan_type, is_active, start_date)
         VALUES ($1, 'nipote', true, NOW())`,
        [newUser.id]
      );
      await client.query(`INSERT INTO user_profiles (user_id) VALUES ($1)`, [newUser.id]);

      return newUser;
    });

    const token = signSessionToken(user.id);
    res.cookie(SESSION_COOKIE, token, cookieOptions);

    // Best-effort: un fallo de email no debe tumbar el registro.
    sendMail(
      user.email,
      '¡Bienvenido a Sabora! 🍳',
      `<p>Hola <strong>${user.username}</strong>, gracias por unirte a Sabora.</p>`,
      `Hola ${user.username}, gracias por unirte a Sabora.`
    ).catch((err) => console.warn('No se pudo enviar el email de bienvenida:', err));

    return res.status(201).json({ user: toPublicUser(user) });
  } catch (err) {
    console.error('Error en signup:', err);
    return res.status(500).json({ error: 'No se pudo crear la cuenta' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Faltan campos: email, password' });
  }

  const GENERIC_ERROR = { error: 'Credenciales inválidas' };
  const normalizedEmail = normalizeEmail(email);

  try {
    const { rows } = await pool.query(
      'SELECT id, email, username, avatar_url, password_hash FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json(GENERIC_ERROR);
    }

    const user = rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json(GENERIC_ERROR);
    }

    const token = signSessionToken(user.id);
    res.cookie(SESSION_COOKIE, token, cookieOptions);
    return res.json({ user: toPublicUser(user) });
  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ error: 'No se pudo iniciar sesión' });
  }
});

router.post('/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE, { ...cookieOptions, maxAge: undefined });
  return res.status(204).send();
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, email, username, avatar_url FROM users WHERE id = $1',
      [req.userId]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    return res.json({ user: toPublicUser(rows[0]) });
  } catch (err) {
    console.error('Error en /me:', err);
    return res.status(500).json({ error: 'Error al obtener la sesión' });
  }
});

router.patch('/me', requireAuth, async (req, res) => {
  const { username } = req.body ?? {};
  if (typeof username !== 'string' || !username.trim()) {
    return res.status(400).json({ error: 'username es obligatorio' });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE users SET username = $1, updated_at = NOW() WHERE id = $2
       RETURNING id, email, username, avatar_url`,
      [username.trim(), req.userId]
    );
    return res.json({ user: toPublicUser(rows[0]) });
  } catch (err) {
    console.error('Error actualizando perfil:', err);
    return res.status(500).json({ error: 'No se pudo actualizar el perfil' });
  }
});

router.post('/update-password', requireAuth, async (req, res) => {
  const { password } = req.body ?? {};
  if (typeof password !== 'string' || password.length < PASSWORD_MIN_LENGTH) {
    return res.status(400).json({ error: `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres` });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    await pool.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [
      passwordHash,
      req.userId,
    ]);
    return res.status(204).send();
  } catch (err) {
    console.error('Error actualizando contraseña:', err);
    return res.status(500).json({ error: 'No se pudo actualizar la contraseña' });
  }
});

// Respuesta siempre genérica (evita confirmar/descartar si un email existe).
const GENERIC_FORGOT_RESPONSE = {
  message: 'Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña.',
};

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body ?? {};
  if (typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ error: 'email es obligatorio' });
  }

  const normalizedEmail = normalizeEmail(email);

  try {
    const { rows } = await pool.query('SELECT id, email FROM users WHERE email = $1', [normalizedEmail]);

    if (rows.length > 0) {
      const user = rows[0];
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

      await pool.query(
        `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
         VALUES ($1, $2, $3)`,
        [user.id, tokenHash, expiresAt]
      );

      const resetLink = `${env.appUrl}/reset-password?token=${rawToken}`;
      await sendMail(
        user.email,
        'Restablece tu contraseña de Sabora',
        `<p>Haz clic en el siguiente enlace para restablecer tu contraseña. Caduca en 30 minutos.</p>
         <p><a href="${resetLink}">${resetLink}</a></p>`,
        `Restablece tu contraseña aquí: ${resetLink}`
      );
    }

    return res.json(GENERIC_FORGOT_RESPONSE);
  } catch (err) {
    console.error('Error en forgot-password:', err);
    // No revelamos detalles del error tampoco: misma respuesta genérica.
    return res.json(GENERIC_FORGOT_RESPONSE);
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body ?? {};
  if (typeof token !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Faltan campos: token, password' });
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return res.status(400).json({ error: `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres` });
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  try {
    await withTransaction(async (client) => {
      const { rows } = await client.query(
        `SELECT id, user_id FROM password_reset_tokens
         WHERE token_hash = $1 AND used_at IS NULL AND expires_at > NOW()
         FOR UPDATE`,
        [tokenHash]
      );

      if (rows.length === 0) {
        throw Object.assign(new Error('Token inválido o expirado'), { status: 400 });
      }

      const { id: tokenId, user_id: userId } = rows[0];
      const passwordHash = await bcrypt.hash(password, 12);

      await client.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [
        passwordHash,
        userId,
      ]);
      await client.query('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1', [tokenId]);
    });

    return res.status(204).send();
  } catch (err: any) {
    if (err?.status === 400) {
      return res.status(400).json({ error: err.message });
    }
    console.error('Error en reset-password:', err);
    return res.status(500).json({ error: 'No se pudo restablecer la contraseña' });
  }
});

export default router;
