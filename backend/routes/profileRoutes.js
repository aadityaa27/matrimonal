import express from 'express';
import { getProfiles, getProfileById, updateProfile, getCities } from '../controllers/profileController.js';
import { optionalAuth, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getProfiles);
router.get('/cities', getCities);
router.get('/:id', optionalAuth, getProfileById);
router.put('/:id', authenticateToken, updateProfile);

export default router;
