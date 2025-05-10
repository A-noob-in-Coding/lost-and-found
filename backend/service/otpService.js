import pool from '../config/db.js';
import nodemailer from 'nodemailer';

export const sendOTPEmail = async (email, otp) => {
  try {
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    // Remove password logging for security
    // console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
    
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

export const storeOTP = async (email, otp) => {
  const client = await pool.connect();
  try {
    console.log(email, otp);

    const createdAt = new Date(); // now
    const expiresAt = new Date(createdAt.getTime() + 5 * 60 * 1000); // 5 minutes later

    await client.query('BEGIN');

    await client.query(
      `INSERT INTO otp (email, otp, is_verified, created_at, expires_at)
       VALUES ($1, $2, false, $3, $4)
       ON CONFLICT (email)
       DO UPDATE SET
         otp = $2,
         is_verified = false,
         created_at = $3,
         expires_at = $4`,
      [email, otp, createdAt, expiresAt]
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
    
    // Use the expires_at column directly for expiry checking
    const result = await client.query(
      `SELECT * FROM otp WHERE email = $1 AND otp = $2 AND expires_at > NOW()`,
      [email, otp]
    );
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return { success: false, message: 'Invalid or expired OTP' };
    }
    
    // Update is_verified flag instead of deleting
    await client.query(
      `UPDATE otp SET is_verified = true WHERE email = $1`,
      [email]
    );
    
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

// Function to cleanup expired OTP records
export const cleanupExpiredOTPs = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Use the expires_at column directly for cleanup
    const deleteQuery = `DELETE FROM otp WHERE expires_at < NOW()`;
    const result = await client.query(deleteQuery);
    await client.query('COMMIT');
    console.log(`Cleaned up ${result.rowCount} expired OTP records`);
    return result.rowCount;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error cleaning up expired OTPs:', error);
    throw new Error('Failed to cleanup expired OTPs');
  } finally {
    client.release();
  }
};

// Debugging function to check timestamp handling
export const debugOTPTimestamps = async (email) => {
  const client = await pool.connect();
  try {
    // Get OTP record for this email
    const otpQuery = await client.query(
      `SELECT 
         email, otp, created_at, expires_at, 
         NOW() as current_time, 
         expires_at > NOW() as is_valid
       FROM otp 
       WHERE email = $1`,
      [email]
    );
    
    // Get database timezone info
    const tzQuery = await client.query(`SHOW timezone`);
    
    console.log('DB Timezone:', tzQuery.rows[0].timezone);
    console.log('OTP Record:', otpQuery.rows[0]);
    
    return {
      dbTimezone: tzQuery.rows[0].timezone,
      otpRecord: otpQuery.rows[0]
    };
  } catch (error) {
    console.error('Error in debugOTPTimestamps:', error);
  } finally {
    client.release();
  }
};