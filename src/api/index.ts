import express from 'express';
const router = express.Router();

import userRoute from './routes/userRoute';
import productRoute from './routes/productRoute';
import orderRoute from './routes/orderRoute';

router.use('users', userRoute);
router.use('order', orderRoute);
router.use('products', productRoute);

export default router;
