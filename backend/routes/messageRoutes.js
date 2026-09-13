import express from 'express';
import { getConversations, getThread, sendMessage } from '../controllers/messageController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getConversations);
router.get('/:partnerId', getThread);
router.post('/', sendMessage);

export default router;
