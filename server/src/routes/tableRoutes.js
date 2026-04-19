import express from 'express';
import {
  createTable,
  deleteTable,
  getTableQrCode,
  getTables,
  updateTable
} from '../controllers/tableController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, authorize('admin', 'staff'), getTables).post(protect, authorize('admin'), createTable);
router.route('/:id/qr').get(protect, authorize('admin', 'staff'), getTableQrCode);
router
  .route('/:id')
  .put(protect, authorize('admin'), updateTable)
  .delete(protect, authorize('admin'), deleteTable);

export default router;
