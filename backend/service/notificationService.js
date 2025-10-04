// notificationService.js
import pool from '../config/db.js';
import nodemailer from 'nodemailer';

// Function to store notification in database
export const storeNotification = async (senderEmail, receiverEmail) => {
  try {
    const query = 'INSERT INTO notification (sender, receiver) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [senderEmail, receiverEmail]);
    console.log('Notification stored in database:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error storing notification:', error);
    throw new Error(`Failed to store notification: ${error.message}`);
  }
};

// Function to get notifications for a user
export const getNotificationsByReceiver = async (receiverEmail) => {
  try {
    const query = 'SELECT * FROM notification WHERE receiver = $1 ORDER BY id DESC';
    const result = await pool.query(query, [receiverEmail]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }
};

// Function to get notification count for a user
export const getNotificationCount = async (receiverEmail) => {
  try {
    const query = 'SELECT COUNT(*) FROM notification WHERE receiver = $1';
    const result = await pool.query(query, [receiverEmail]);
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error('Error getting notification count:', error);
    throw new Error(`Failed to get notification count: ${error.message}`);
  }
};

// Function to delete a notification
export const deleteNotification = async (notificationId) => {
  try {
    const query = 'DELETE FROM notification WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [notificationId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw new Error(`Failed to delete notification: ${error.message}`);
  }
};

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
      <p>We are pleased to inform you that <strong>${finderName}</strong> has found your item: <strong>${itemTitle}</strong>.</p>
      <p>Please log in to the Lost and Found application to delete the post if it is no longer needed.</p>
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
<p>Please log in to the Lost and Found application to delete the post if it is no longer needed.</p>
      <p>Thank you for using our service!</p>
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #777;">
        <p>This is an automated message. Please do not reply to this email.</p>
      </div>
    </div>
  `;
};
