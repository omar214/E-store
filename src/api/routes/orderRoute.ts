import express from 'express';
import verifyAuth from '../../middlewares/authMiddlware';
import orderController from '../controllers/orderController';
const router = express.Router();

// user orders [GET]
router.get('/', verifyAuth, orderController.getUserOrders);

// completed user orders [GET]
router.get('/completed', verifyAuth, orderController.getCompletedOrders);

export default router;
