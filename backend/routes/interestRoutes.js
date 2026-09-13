import express from 'express';
import {
  sendInterest,
  getSentInterests,
  getReceivedInterests,
  updateInterestStatus,
} from '../controllers/interestController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', sendInterest);
router.get('/sent', getSentInterests);
router.get('/received', getReceivedInterests);
router.put('/:id', updateInterestStatus);

export default router;
