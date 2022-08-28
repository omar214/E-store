import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import createError from '../utils/createError';

// Verify
const verifyAuth = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization as string;
	const JWT_KEY = config.JWT_PASSWORD as string;

	if (!token) next(createError(401, 'No token provided'));
	try {
		const decoded = jwt.verify(token, JWT_KEY);
		req.body.decoded = decoded;
		next();
	} catch (err) {
		next(err);
	}
};

export default verifyAuth;
