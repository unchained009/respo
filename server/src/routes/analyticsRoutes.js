import express from 'express';
import { getAnalyticsSummary } from '../controllers/analyticsController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', protect, authorize('admin', 'staff'), getAnalyticsSummary);

export default router;
