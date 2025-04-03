import express, { json } from 'express';
import cors from 'cors';
const app = express();
import uploadRoutes from './routes/upload.js';
import userRouter from './routes/userRoutes.js';
import otpRouter from './routes/otpRoutes.js';
import postRouter from "./routes/postRoutes.js";

import dotenv from 'dotenv';
dotenv.config();

app.use(cors());
app.use(express.json());

app.use('/upload', uploadRoutes);
app.use('/api/users',userRouter);
app.use('/api/otp',otpRouter);
app.use("/api/posts", postRouter);

app.get('/', (req, res) => {
  res.send('Express PostgreSQL Cloudinary API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
