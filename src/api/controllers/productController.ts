import productModel from '../../models/productModel';
import createError from '../../utils/createError';
import { NextFunction, Request, Response } from 'express';

const getAllProducts = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		console.log('asdasd');

		const products = await productModel.getAllProducts();
		res.status(200).json({ products });
	} catch (error) {
		next(error);
	}
};

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.params.id;
		if (!id) return next(createError(400, 'id is required'));

		const product = await productModel.getProductById(parseInt(id));
		if (!product)
			return next(createError(404, `no product found with id ${id}`));
		res.status(200).json({ product });
	} catch (error) {
		next(error);
	}
};

const addProduct = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, price } = req.body;
		if (!name || !price)
			return next(
				createError(400, 'missing parameter ; name, price are required'),
			);

		let product = await productModel.getProductByName(name);
		if (product) return next(createError(409, 'product already exists'));

		const savedProduct = await productModel.addProduct({ name, price });

		res.status(200).json({
			msg: 'product add',
			product: savedProduct,
		});
	} catch (error) {
		next(error);
	}
};
export default { getProduct, getAllProducts, addProduct };
