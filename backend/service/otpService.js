// otpService.js
import pool from '../config/db.js';
import nodemailer from 'nodemailer';

export const sendOTPEmail = async (email, otp) => {
  try {
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email credentials not configured in environment variables');
    }
    
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Verification OTP for Lost and Found',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">Verification Code</h2>
          <p>Your OTP for account verification is:</p>
          <h1 style="font-size: 32px; background-color: #f5f5f5; padding: 10px; text-align: center; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

// Updated to match otp table structure with rollno instead of email
export const storeOTP = async (email, otp) => {
  const client = await pool.connect();
  try {
    console.log(email, otp);
    await client.query('BEGIN');
    await client.query(
      `INSERT INTO otp (email, otp, expires_at, is_verified) VALUES ($1, $2, NOW() + INTERVAL '5 minutes', false) ON CONFLICT (email) DO UPDATE SET otp = $2, expires_at = NOW() + INTERVAL '5 minutes', is_verified = false`,
      [email, otp]
    );
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error storing OTP:', error);
    throw new Error('Failed to store OTP');
  } finally {
    client.release();
  }
};

export const verifyOTPService = async (email, otp) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `SELECT * FROM otp WHERE email = $1 AND otp = $2 AND expires_at > NOW()`,
      [email, otp]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return { success: false, message: 'Invalid or expired OTP' };
    }

    // Delete OTP after successful verification
    // await client.query(`DELETE FROM otp WHERE email = $1`, [email]);
    await client.query('COMMIT');

    return { success: true, message: 'OTP verified successfully. Account activated.' };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error verifying OTP:', error);
    throw new Error('Error verifying OTP');
  } finally {
    client.release();
  }
};