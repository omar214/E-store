import userModel from '../../models/userModel';
import jwt from 'jsonwebtoken';
import createError from '../../utils/createError';
import { NextFunction, Request, Response } from 'express';
import { compareSync } from 'bcryptjs';
import config from '../../config';

const genToken = (id: number) => {
	return jwt.sign({ id }, config.JWT_PASSWORD as string, {
		expiresIn: '24h',
	});
};

const singup = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, first_name, last_name, password } = req.body;
		if (!email || !first_name || !last_name || !password)
			return next(
				createError(
					400,
					'missing parameter ; Email, first_name, last_name , and password are required',
				),
			);

		let user = await userModel.getUserByEmail(email);
		if (user) return next(createError(409, 'User already exists'));

		const savedUser = await userModel.addUser({
			email,
			first_name,
			last_name,
			password,
		});
		const token = genToken(savedUser.id as number);
		res.status(200).json({
			msg: 'sign up successful',
			user: savedUser,
			token,
		});
	} catch (error) {
		next(error);
	}
};

const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body;
		if (!email || !password)
			return next(createError(400, 'Email , and password are required'));

		const user = await userModel.getUserByEmail(email);
		if (!user) return next(createError(404, 'User not found'));
		console.log(user);

		const isMatch = userModel.authenticateUser(email, password);

		if (!isMatch) return next(createError(401, 'Invalid password'));

		const token = genToken(user.id as number);
		res.status(200).json({
			message: 'Login successful',
			token: token,
			user,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

export default { singup, login };
