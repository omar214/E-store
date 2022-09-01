import express from 'express';
import verifyAuth from '../../middlewares/authMiddlware';
import cartController from '../controllers/cartController';
const router = express.Router();

router.get('/', verifyAuth, cartController.getCartProducts);

router.post('/', verifyAuth, cartController.addProduct);

router.patch('/', verifyAuth, cartController.updateProduct);

router.delete('/', verifyAuth, cartController.deleteProduct);

router.post('/checkout', verifyAuth, cartController.checkout);

export default router;
