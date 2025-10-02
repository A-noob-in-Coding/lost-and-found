import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService.js';
import { useAuth } from './authContext.jsx';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch notification count
  const fetchNotificationCount = async () => {
    if (!user?.email) return;
    
    try {
      const count = await notificationService.getNotificationCount(user.email);
      setNotificationCount(count);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      const userNotifications = await notificationService.getUserNotifications(user.email);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setNotificationCount(prev => Math.max(0, prev - 1));
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  };

  // Send notification
  const sendNotification = async (type, senderEmail, receiverEmail, itemTitle) => {
    try {
      if (type === 'found') {
        await notificationService.sendFoundItemNotification(senderEmail, receiverEmail, itemTitle);
      } else if (type === 'claim') {
        await notificationService.sendClaimItemNotification(senderEmail, receiverEmail, itemTitle);
      }
      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  };

  // Refresh notifications
  const refreshNotifications = async () => {
    await fetchNotificationCount();
    await fetchNotifications();
  };

  // Auto-fetch when user changes
  useEffect(() => {
    if (user?.email) {
      fetchNotificationCount();
    } else {
      setNotifications([]);
      setNotificationCount(0);
    }
  }, [user]);

  const value = {
    notifications,
    notificationCount,
    loading,
    fetchNotifications,
    deleteNotification,
    sendNotification,
    refreshNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};