import express from 'express';
import {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(createOrder).get(protect, authorize('admin', 'staff'), getOrders);
router.route('/:id').get(protect, authorize('admin', 'staff'), getOrderById);
router.route('/:id/status').patch(protect, authorize('admin', 'staff'), updateOrderStatus);

export default router;
