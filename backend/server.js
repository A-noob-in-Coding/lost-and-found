import express, { json } from 'express';
import cors from 'cors';
const app = express();
import uploadRoutes from './routes/upload.js';
import otpRouter from './routes/otpRoutes.js';
import userPostRouter from './routes/userPostRoutes.js';
import adminPostRouter from './routes/adminPostRoutes.js';
import userRouter from './routes/userRoutes.js';
import Utilrouter from './routes/utilityRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import notificationRouter from './routes/notificationRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import { cleanupExpiredOTPs } from './service/otpService.js'; //=====?
import dotenv from 'dotenv';
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/comment',commentRoutes)
app.use('/upload', uploadRoutes);
app.use('/api/users',userRouter);
app.use('/api/otp',otpRouter);
app.use('/api/user/posts', userPostRouter); 
app.use('/api/admin/posts', adminPostRouter);
app.use('/utility',Utilrouter)
app.use('/api/notifications', notificationRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/campuses', campusRouter)
app.get('/', (req, res) => {
  res.send('Express PostgreSQL Cloudinary API is running');
});

// cleanupExpiredOTPs().catch();
// // Run cleanup every 5 minutes
// const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
// setInterval(() => {
//   cleanupExpiredOTPs().catch();
// }, CLEANUP_INTERVAL);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
