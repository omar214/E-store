import express from 'express';
import verifyAuth from '../../middlewares/authMiddlware';
import productController from '../controllers/productController';
const router = express.Router();

router.get('/', productController.getAllProducts);

router.get('/:id', productController.getProduct);

router.post('/', verifyAuth, productController.addProduct);

export default router;
