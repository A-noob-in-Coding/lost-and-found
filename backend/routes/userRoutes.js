import express from 'express';
import { authenticateUser, changePassword, getUserByRollNo, registerUser } from '../controller/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.get('/:rollNo', getUserByRollNo);
userRouter.post('/login',authenticateUser);
userRouter.post('/changePassword',changePassword);
export default userRouter;
