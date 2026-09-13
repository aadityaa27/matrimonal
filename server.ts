import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initDatabase, getDbInfo, resetDatabase } from './backend/db/connection.js';
import authRoutes from './backend/routes/authRoutes.js';
import profileRoutes from './backend/routes/profileRoutes.js';
import interestRoutes from './backend/routes/interestRoutes.js';
import messageRoutes from './backend/routes/messageRoutes.js';
import adminRoutes from './backend/routes/adminRoutes.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing for JSON and urlencoded data
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Initialize unified database engine (MySQL with automatic local fallback)
  await initDatabase();

  // ==========================================
  // REST API ROUTES
  // ==========================================

  // Health check & DB engine information
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      application: 'Bandhan Matrimonial',
      tagline: 'Find Your Perfect Connection',
      time: new Date().toISOString(),
      ...getDbInfo(),
    });
  });

  // DB Reset endpoint
  app.post('/api/db/reset', async (req, res) => {
    try {
      const result = await resetDatabase();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to reset database', message: err.message });
    }
  });

  // Core API Modules
  app.use('/api/auth', authRoutes);
  app.use('/api/profiles', profileRoutes);
  app.use('/api/interests', interestRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/admin', adminRoutes);

  // Global Error Handler for API routes
  app.use('/api', (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[API Internal Error]:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  });

  // ==========================================
  // Vite Middleware & SPA Static Asset Serving
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bandhan Matrimonial running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
