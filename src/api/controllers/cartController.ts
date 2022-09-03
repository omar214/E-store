import cartModel from '../../models/cartModel';

import createError from '../../utils/createError';
import { NextFunction, Request, Response } from 'express';
import orderModel from '../../models/orderModel';

const getCartProducts = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const {
			decoded: { id: userId },
		} = req.body;
		const cartProducts = await cartModel.getCartProducts(userId);

		res.status(200).json({ cartProducts });
	} catch (error) {
		next(error);
	}
};
const updateProduct = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const {
			decoded: { id: cart_owner },
		} = req.body;
		let { product_id, quantity } = req.body;
		quantity = quantity < 1 ? 1 : quantity;

		const product = await cartModel.updateCartProduct({
			cart_owner,
			product_id,
			quantity,
		});

		res.status(200).json({
			msg: 'product updated',
		});
	} catch (error) {
		next(error);
	}
};
const addProduct = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {
			decoded: { id: cart_owner },
		} = req.body;
		let { product_id, quantity } = req.body;
		quantity = quantity < 1 ? 1 : quantity;

		const product = await cartModel.addToCart({
			cart_owner,
			product_id,
			quantity,
		});

		res.status(200).json({
			msg: 'added to cart',
			product,
		});
	} catch (error) {
		next(error);
	}
};
const deleteProduct = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const {
			decoded: { id: cart_owner },
		} = req.body;
		const { product_id } = req.body;

		const product = await cartModel.deleteFromCart({
			cart_owner,
			product_id,
		});

		res.status(200).json({
			msg: 'product deleted from  to cart',
		});
	} catch (error) {
		next(error);
	}
};

const checkout = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {
			decoded: { id: cart_owner },
		} = req.body;
		const products = await cartModel.getCartProducts(cart_owner as number);
		if (products.length === 0)
			return next(createError(404, 'no cart found to checkout'));

		const { id: orderId } = await orderModel.addOrder({
			userId: cart_owner as number,
			status: 'complete',
		});
		await orderModel.addOrderProducts(products, orderId as number);
		await cartModel.checkout(cart_owner);
		res.status(200).json({
			msg: 'Check Out Done',
		});
	} catch (error) {
		// console.log(error);
		next(error);
	}
};

export default {
	getCartProducts,
	updateProduct,
	addProduct,
	deleteProduct,
	checkout,
};
