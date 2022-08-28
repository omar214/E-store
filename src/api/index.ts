import express from 'express';
const router = express.Router();

import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';
import productRoute from './routes/productRoute';
import orderRoute from './routes/orderRoute';

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/orders', orderRoute);
router.use('/products', productRoute);

export default router;
