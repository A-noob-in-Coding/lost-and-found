// notificationController.js
import { 
  sendEmailNotification, 
  createFoundItemEmailContent, 
  createClaimItemEmailContent,
  storeNotification,
  getNotificationsByReceiver,
  getNotificationCount,
  deleteNotification
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
    // Store notification in database first
    await storeNotification(senderEmail, receiverEmail);
    
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
    // Store notification in database first
    await storeNotification(senderEmail, receiverEmail);
    
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

// Controller to get notifications for a user
export const getUserNotifications = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const notifications = await getNotificationsByReceiver(email);
    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error in getUserNotifications:', error);
    res.status(500).json({ message: 'Failed to get notifications', error: error.message });
  }
};

// Controller to get notification count for a user
export const getUserNotificationCount = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const count = await getNotificationCount(email);
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error in getUserNotificationCount:', error);
    res.status(500).json({ message: 'Failed to get notification count', error: error.message });
  }
};

// Controller to delete a notification
export const removeNotification = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Notification ID is required' });
  }

  try {
    const deletedNotification = await deleteNotification(id);
    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error in removeNotification:', error);
    res.status(500).json({ message: 'Failed to delete notification', error: error.message });
  }
};
