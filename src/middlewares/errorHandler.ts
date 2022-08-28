import { Request, Response, NextFunction } from 'express';
import responseError from '../types/error';

const handleRouteError = (
	err: responseError,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const status = err.status ?? 500;
	const message = err.message ?? 'Something went wrong!';
	return res.status(status).json({
		success: false,
		status,
		message,
	});
};

// handle not found routes
const handleNotFound = (req: Request, res: Response) => {
	res.status(404);
	res.json({
		error: { message: 'Not found' },
	});
};

export { handleNotFound, handleRouteError };
