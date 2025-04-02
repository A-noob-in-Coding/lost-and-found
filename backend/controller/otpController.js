import crypto from "crypto"
import { sendOTPEmail, storeOTP, verifyOTPService } from "../service/otpService.js";

// Generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
};

// Controller for sending OTP
export const sendOTPController = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();

  try {
    await sendOTPEmail(email, otp);
    await storeOTP(email, otp);
    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

export const verifyOTPController = async (req, res) => {
  const { email, otp } = req.body;
  
  try {
    const result = await verifyOTPService(email, otp);
    
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    
    res.status(200).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};