import express from 'express';
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItemById,
  getMenuItems,
  resetMenu,
  updateMenuItem
} from '../controllers/menuController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, authorize('admin', 'staff'), getMenuItems).post(protect, authorize('admin'), createMenuItem);
router.route('/reset').delete(protect, authorize('admin'), resetMenu);
router
  .route('/:id')
  .get(protect, authorize('admin', 'staff'), getMenuItemById)
  .put(protect, authorize('admin'), updateMenuItem)
  .delete(protect, authorize('admin'), deleteMenuItem);

export default router;
