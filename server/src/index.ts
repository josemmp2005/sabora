import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './env.js';
import authRoutes from './routes/auth.js';
import recipesRoutes from './routes/recipes.js';
import profileRoutes from './routes/profile.js';
import subscriptionRoutes from './routes/subscription.js';
import aiRoutes from './routes/ai.js';

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/ai', aiRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` });
});

app.listen(env.port, () => {
  console.log(`🚀 Sabora API escuchando en http://localhost:${env.port}`);
});
