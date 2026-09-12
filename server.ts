import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { dbQueries } from './server/db.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing for JSON and urlencoded data (supporting base64 images up to 50mb)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // ==========================================
  // API ROUTES (Mounted BEFORE Vite middleware)
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Real Database Status & Statistics
  app.get('/api/db/status', (req, res) => {
    try {
      const info = dbQueries.getDbInfo();
      res.json(info);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to inspect database', message: err.message });
    }
  });

  // Reset Database to Fresh Seed Fixtures
  app.post('/api/db/reset', (req, res) => {
    try {
      const resetInfo = dbQueries.resetDatabase();
      res.json({
        success: true,
        message: 'SQLite database reset to initial fixture successfully',
        dbInfo: resetInfo,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to reset database', message: err.message });
    }
  });

  // Candidate Registration
  app.post('/api/accounts/register', (req, res) => {
    try {
      const {
        fullName,
        email,
        password,
        gender,
        dateOfBirth,
        city,
        bio,
        phone,
        occupation,
        photos,
      } = req.body;

      if (!fullName || !email || !password) {
        return res.status(400).json({ error: 'Full name, email, and password are required' });
      }

      // Check for duplicate email
      const existing = dbQueries.findAccountByEmail(email);
      if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists' });
      }

      const accountId = `candidate-${Date.now()}`;
      const photosArray = Array.isArray(photos) ? photos : [];

      // Enforce 10 photos limit
      const photosToInsert = photosArray.slice(0, 10).map((p: any, idx: number) => ({
        id: p.id || `photo-${Date.now()}-${idx}`,
        url: p.url,
        isPrimary: Boolean(p.isPrimary),
        caption: p.caption || `Photo ${idx + 1}`,
      }));

      const newAccount = dbQueries.createAccount(
        {
          id: accountId,
          email,
          password,
          fullName,
          gender: gender || 'Bride',
          dateOfBirth: dateOfBirth || '',
          city: city || '',
          bio: bio || '',
          phone: phone || '',
          occupation: occupation || '',
        },
        photosToInsert
      );

      res.status(201).json({
        success: true,
        message: `Registered candidate ${newAccount.fullName} with ${newAccount.photos?.length || 0} photos in SQLite database`,
        user: newAccount,
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Failed to register candidate', message: err.message });
    }
  });

  // Candidate Login
  app.post('/api/accounts/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = dbQueries.findAccountByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      res.json({
        success: true,
        message: `Authenticated as ${user.fullName}`,
        user,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Login failure', message: err.message });
    }
  });

  // Fetch Candidate Account
  app.get('/api/accounts/:id', (req, res) => {
    try {
      const user = dbQueries.findAccountById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'Account not found' });
      }
      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch account', message: err.message });
    }
  });

  // Update Candidate Details
  app.put('/api/accounts/:id', (req, res) => {
    try {
      const updated = dbQueries.updateAccount(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Account not found' });
      }
      res.json({
        success: true,
        message: 'Candidate profile updated in database',
        user: updated,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update account', message: err.message });
    }
  });

  // Add Photo to Candidate Album (Up to 10 photos in SQLite)
  app.post('/api/accounts/:id/photos', (req, res) => {
    try {
      const { url, caption, isPrimary } = req.body;
      if (!url) {
        return res.status(400).json({ error: 'Photo URL or base64 data is required' });
      }

      const photoId = `photo-${Date.now()}`;
      const newPhoto = dbQueries.addPhotoToAccount(req.params.id, {
        id: photoId,
        url,
        caption,
        isPrimary,
      });

      res.status(201).json({
        success: true,
        message: 'Photo stored in SQLite database album',
        photo: newPhoto,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Delete Photo from Candidate Album
  app.delete('/api/accounts/:id/photos/:photoId', (req, res) => {
    try {
      const ok = dbQueries.deletePhoto(req.params.id, req.params.photoId);
      if (!ok) {
        return res.status(404).json({ error: 'Photo not found' });
      }
      res.json({ success: true, message: 'Photo deleted from database album' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete photo', message: err.message });
    }
  });

  // Set Photo as Primary
  app.put('/api/accounts/:id/photos/:photoId/primary', (req, res) => {
    try {
      const ok = dbQueries.setPrimaryPhoto(req.params.id, req.params.photoId);
      if (!ok) {
        return res.status(404).json({ error: 'Photo not found' });
      }
      res.json({ success: true, message: 'Primary photo updated' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to set primary photo', message: err.message });
    }
  });

  // Candidate Directory Profiles
  app.get('/api/profiles', (req, res) => {
    try {
      const profiles = dbQueries.getAllProfiles();
      res.json(profiles);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch profiles', message: err.message });
    }
  });

  // Toggle Shortlist on Profile
  app.post('/api/profiles/:id/shortlist', (req, res) => {
    try {
      const isShortlisted = dbQueries.toggleProfileShortlist(req.params.id);
      res.json({ success: true, isShortlisted });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to toggle shortlist', message: err.message });
    }
  });

  // Send Interest to Profile
  app.post('/api/profiles/:id/interest', (req, res) => {
    try {
      dbQueries.setProfileInterestStatus(req.params.id, 'pending');
      res.json({ success: true, interestStatus: 'pending' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to send interest', message: err.message });
    }
  });

  // Interest Requests
  app.get('/api/interests', (req, res) => {
    try {
      const interests = dbQueries.getInterestRequests();
      res.json(interests);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch interests', message: err.message });
    }
  });

  // Update Interest Status
  app.post('/api/interests/:id/status', (req, res) => {
    try {
      const { status } = req.body;
      if (status !== 'accepted' && status !== 'declined') {
        return res.status(400).json({ error: 'Status must be accepted or declined' });
      }
      dbQueries.updateInterestStatus(req.params.id, status);
      res.json({ success: true, status });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update status', message: err.message });
    }
  });

  // ==========================================
  // Vite Middleware & SPA Static Asset Serving
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
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
    console.log(`Server running on http://localhost:${PORT} with SQLite database`);
  });
}

startServer();
