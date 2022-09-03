import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import { handleNotFound, handleRouteError } from './middlewares/errorHandler';
import allRoutes from './api';
import config from './config';
import db from './database';

const app = express();

if (config.ENV === 'dev') {
	app.use(morgan('dev'));
}
app.use(express.urlencoded({ extended: true })); // send nested objects
app.use(express.json()); // serve static files

app.listen(config.PORT, () => {
	console.log('Server listening on Port', config.PORT);
});

// Routes which should handle requests
app.use('/api', allRoutes);
app.use(handleRouteError); // handle errors
app.use('*', handleNotFound); // handle not found routes

export default app;
