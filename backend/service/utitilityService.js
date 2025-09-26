// misc services

import pool from "../config/db.js"
import nodemailer from 'nodemailer';

export const getCategoriesService = async () => {
  try {
    const query = 'select * from category'
    const result = await pool.query(query)
    return result.rows
  }
  catch (error) {
    console.log("error fetching categories")
    throw error
  }
}

export const sendContactEmailService = async (name, email, message) => {
  try {
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
      from: email,
      to: process.env.EMAIL_USER, // Send to your system's email
      subject: `Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="margin-top: 20px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Contact form email sent successfully' };
  } catch (error) {
    console.error('Error sending contact form email:', error);
    throw new Error(`Failed to send contact form email: ${error.message}`);
  }
};

export const getAllCampusService = async () => {
  try {
    const query = `select "campusName" from campus`
    const result = await pool.query(query)
    return result.rows.map(row => row.campusName)
  } catch (error) {
    throw new Error(`error while fetching campus, ${error.message}`)
  }
}
