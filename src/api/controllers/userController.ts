import userModel from '../../models/userModel';
import createError from '../../utils/createError';
import { NextFunction, Request, Response } from 'express';

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await userModel.getAllUsers();
		res.status(200).json({
			users,
		});
	} catch (error) {
		next(error);
	}
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.params.id;
		if (!id) return next(createError(400, 'id is required'));

		const user = await userModel.getUserById(parseInt(id));
		if (!user) return next(createError(404, `no user found with id ${id}`));
		res.status(200).json({ user });
	} catch (error) {
		next(error);
	}
};

export default { getUser, getAllUsers };
