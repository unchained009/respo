import express from 'express';
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory
} from '../controllers/categoryController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, authorize('admin', 'staff'), getCategories).post(protect, authorize('admin'), createCategory);
router
  .route('/:id')
  .put(protect, authorize('admin'), updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

export default router;
