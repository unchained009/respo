import express from 'express';
import {
  getDeliveryQrCode,
  getRestaurantProfile,
  resolveGuestAccess,
  updateRestaurantSettings
} from '../controllers/restaurantController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/settings', protect, authorize('admin', 'staff'), getRestaurantProfile);
router.put('/settings', protect, authorize('admin'), updateRestaurantSettings);
router.get('/delivery-qr', protect, authorize('admin', 'staff'), getDeliveryQrCode);
router.get('/:slug/access/:accessToken', resolveGuestAccess);

export default router;
