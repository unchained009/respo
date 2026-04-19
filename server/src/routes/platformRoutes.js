import express from 'express';
import { getPlatformStats, subscribeRestaurant } from '../controllers/platformController.js';

const router = express.Router();

router.get('/stats', getPlatformStats);
router.post('/subscribe', subscribeRestaurant);

export default router;
