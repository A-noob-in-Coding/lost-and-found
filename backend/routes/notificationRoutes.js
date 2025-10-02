// notificationRoutes.js
import express from "express";
import { 
  sendFoundItemNotification,
  sendClaimItemNotification,
  getUserNotifications,
  getUserNotificationCount,
  removeNotification
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

// Routes for sending notifications
notificationRouter.post('/found-item', sendFoundItemNotification);
notificationRouter.post('/claim-item', sendClaimItemNotification);

// Routes for managing notifications
notificationRouter.get('/user/:email', getUserNotifications);
notificationRouter.get('/count/:email', getUserNotificationCount);
notificationRouter.delete('/:id', removeNotification);

export default notificationRouter;
