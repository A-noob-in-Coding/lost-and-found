// notificationController.js
import { 
  sendEmailNotification, 
  createFoundItemEmailContent, 
  createClaimItemEmailContent 
} from "../service/notificationService.js";

// Controller for sending found item notification
export const sendFoundItemNotification = async (req, res) => {
  const { senderEmail, receiverEmail, itemTitle } = req.body;

  if (!senderEmail || !receiverEmail || !itemTitle) {
    return res.status(400).json({ message: 'All fields are required: senderEmail, receiverEmail, itemTitle' });
  }

  if (senderEmail === receiverEmail) {
    return res.status(400).json({ message: 'Sender and receiver email cannot be the same.' });
  }

  try {
    // Creating email content using sender's email
    const emailContent = createFoundItemEmailContent(senderEmail, itemTitle);
    
    // Sending notification directly to the receiver email
    await sendEmailNotification(
      receiverEmail,
      'Good News! Your Item Has Been Found',
      emailContent
    );
    
    res.status(200).json({ message: 'Found item notification sent successfully' });
  } catch (error) {
    console.error('Error in sendFoundItemNotification:', error);
    res.status(500).json({ message: 'Failed to send notification', error: error.message });
  }
};

// Controller for sending claim item notification
export const sendClaimItemNotification = async (req, res) => {
  const { senderEmail, receiverEmail, itemTitle } = req.body;

  if (!senderEmail || !receiverEmail || !itemTitle) {
    return res.status(400).json({ message: 'All fields are required: senderEmail, receiverEmail, itemTitle' });
  }

  if (senderEmail === receiverEmail) {
    return res.status(400).json({ message: 'Sender and receiver email cannot be the same.' });
  }

  try {
    // Creating email content using sender's email
    const emailContent = createClaimItemEmailContent(senderEmail, itemTitle);
    
    // Sending notification directly to the receiver email
    await sendEmailNotification(
      receiverEmail,
      'Someone Has Claimed Your Found Item',
      emailContent
    );
    
    res.status(200).json({ message: 'Claim item notification sent successfully' });
  } catch (error) {
    console.error('Error in sendClaimItemNotification:', error);
    res.status(500).json({ message: 'Failed to send notification', error: error.message });
  }
};
