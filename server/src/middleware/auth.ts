import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../env.js';

export const SESSION_COOKIE = 'sabora_session';

interface AccessTokenPayload {
  sub: string; // user id
}

export const signSessionToken = (userId: string): string =>
  jwt.sign({ sub: userId } satisfies AccessTokenPayload, env.jwtSecret, { expiresIn: '7d' });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as AccessTokenPayload;
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Sesión inválida o expirada' });
  }
};

// Para rutas que quieren saber quién llama sin exigirlo (ninguna de momento,
// pero evita repetir el try/catch si hace falta en el futuro).
export const optionalAuth = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (token) {
    try {
      const payload = jwt.verify(token, env.jwtSecret) as AccessTokenPayload;
      req.userId = payload.sub;
    } catch {
      // token inválido: se ignora, sigue como anónimo
    }
  }
  next();
};
