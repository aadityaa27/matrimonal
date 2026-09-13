import express from 'express';
import { getAdminStats, getAdminUsers, deleteUser } from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.delete('/users/:id', deleteUser);

export default router;
