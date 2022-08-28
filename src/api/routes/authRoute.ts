import express from 'express';
const router = express.Router();

import { singup, login } from '../controllers/authController';

router.post('/signup', singup);

router.post('/login', login);

export default router;
