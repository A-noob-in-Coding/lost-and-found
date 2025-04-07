import express from 'express';
import { authenticateUser, changePassword, getUserByRollNo, getUserImage, registerUser } from '../controllers/userController.js';
import upload from '../config/mutler.js';

const userRouter = express.Router();
// For file + body data (multipart/form-data)
userRouter.post('/register', upload.single('imageFile'), registerUser);
userRouter.post('/register', registerUser);
userRouter.get('/:rollNo', getUserByRollNo);
userRouter.post('/login',authenticateUser);
userRouter.post('/changePassword',changePassword);
userRouter.get('/image/:rollNo', getUserImage);
export default userRouter;