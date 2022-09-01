import OrderModel from '../../models/orderModel';
import createError from '../../utils/createError';
import { NextFunction, Request, Response } from 'express';

const getUserOrders = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const {
			decoded: { id: userId },
		} = req.body;

		const userOrders = await OrderModel.getUserOrders(parseInt(userId));

		let products: { quantity: number; productName: string }[] = [];
		userOrders?.quantity?.map((ele, idx) => {
			products.push({
				quantity: ele,
				productName: userOrders?.productname?.[idx] as string,
			});
		});

		res.status(200).json({
			orderId: userOrders.orderid,
			status: userOrders.status,
			products,
		});
	} catch (error) {
		next(error);
	}
};

const getCompletedOrders = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const {
			decoded: { id: userId },
		} = req.body;

		const userOrders = await OrderModel.getUserCompletedOrders(userId);

		let products: { quantity: number; productName: string }[] = [];
		let orders: {
			orderId: number;
			status: string;
			products: typeof products;
		}[] = [];
		userOrders.map((ord) => {
			ord?.quantity?.map((ele, idx) => {
				products.push({
					quantity: ele,
					productName: ord?.productname?.[idx] as string,
				});
			});
			orders.push({ orderId: ord.orderid, status: ord.status, products });
			products = [];
		});

		res.status(200).json({
			orders,
		});
	} catch (error) {
		next(error);
	}
};

export default { getUserOrders, getCompletedOrders };
