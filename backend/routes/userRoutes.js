import express from 'express';
import { 
  authenticateUser, 
  changePassword, 
  checkUserByEmail, 
  getUserByRollNo, 
  getUserImage, 
  registerUser, 
  updateUserName,
  updateUserImage,
  getUserByEmail,
  authenticateAdmin
} from '../controllers/userController.js';
import upload from '../config/mutler.js';

const userRouter = express.Router();
// For file + body data (multipart/form-data)
userRouter.post('/register', upload.single('imageFile'), registerUser);
userRouter.post('/register', registerUser);
userRouter.get('/check-email', checkUserByEmail); //For OTP verification
userRouter.get('/:rollNo', getUserByRollNo);
userRouter.get('/email/get-user', getUserByEmail);
userRouter.post('/login',authenticateUser);
userRouter.post('/changePassword',changePassword);
userRouter.get('/image/:rollNo', getUserImage);
userRouter.put('/updateusername', updateUserName);
userRouter.post('/update-image', upload.single('imageFile'), updateUserImage);
userRouter.post('/loginAdmin',authenticateAdmin);
export default userRouter;