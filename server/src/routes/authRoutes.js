import express from 'express';
import { getMe, loginAdmin, loginDemo } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/demo', loginDemo);
router.get('/me', protect, getMe);

export default router;
