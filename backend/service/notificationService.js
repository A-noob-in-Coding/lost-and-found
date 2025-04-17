// notificationService.js
import pool from '../config/db.js';
import nodemailer from 'nodemailer';

// Function to send email notification
export const sendEmailNotification = async (recipientEmail, subject, htmlContent) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email credentials not configured in environment variables');
    }
    
    // Creating a transporter (reusing the configuration from OTP service)
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
      to: recipientEmail,
      subject: subject,
      html: htmlContent
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Notification email sent successfully to:', recipientEmail);
    return true;
  } catch (error) {
    console.error('Error sending notification email:', error);
    throw new Error(`Failed to send notification email: ${error.message}`);
  }
};

// Function to get user email by rollno 
//geting email of that person who posted the item
export const getUserEmailByRollNo = async (rollno) => {
  try {
    const result = await pool.query('SELECT email FROM "User" WHERE rollno = $1', [rollno]);
    
    if (result.rows.length === 0) {
      throw new Error(`User with rollno ${rollno} not found`);
    }
    
    return result.rows[0].email;
  } catch (error) {
    console.error('Error fetching user email:', error);
    throw new Error(`Failed to get user email: ${error.message}`);
  }
};

// Function to create found item notification content
export const createFoundItemEmailContent = (finderName, itemTitle) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #333;">Good News! Your Item Has Been Found</h2>
      <p>Hello,</p>
      <p>We're pleased to inform you that <strong>${finderName}</strong> has found your item: <strong>${itemTitle}</strong>.</p>
      <p>Please log in to the Lost and Found application to check the details and get in touch with the finder.</p>
      <p>Thank you for using our service!</p>
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #777;">
        <p>This is an automated message. Please do not reply to this email.</p>
      </div>
    </div>
  `;
};

// Function to create claim item notification content
export const createClaimItemEmailContent = (claimerName, itemTitle) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #333;">Item Claim Notification</h2>
      <p>Hello,</p>
      <p>We'd like to inform you that <strong>${claimerName}</strong> has claimed your found item: <strong>${itemTitle}</strong>.</p>
      <p>Please log in to the Lost and Found application to check the details and get in touch with the claimer.</p>
      <p>Thank you for using our service!</p>
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #777;">
        <p>This is an automated message. Please do not reply to this email.</p>
      </div>
    </div>
  `;
};
