import express from 'express';
import verifyAuth from '../../middlewares/authMiddlware';
const router = express.Router();

import userController from '../controllers/userController';

router.get('/', verifyAuth, userController.getAllUsers);

router.get('/:id', verifyAuth, userController.getUser);

export default router;
