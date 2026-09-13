import express from 'express';
import cors from 'cors';
import { initDatabase, getDbInfo, resetDatabase } from './db/connection.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import interestRoutes from './routes/interestRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// REST API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), ...getDbInfo() });
});

app.post('/api/db/reset', async (req, res) => {
  const result = await resetDatabase();
  res.json(result);
});

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[API Error]:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

initDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bandhan Matrimonial API Backend running on http://0.0.0.0:${PORT}`);
  });
});

export default app;
