// notificationRoutes.js
import express from "express";
import { 
  sendFoundItemNotification,
  sendClaimItemNotification
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

// Routes for sending notifications
notificationRouter.post('/found-item', sendFoundItemNotification);
notificationRouter.post('/claim-item', sendClaimItemNotification);

export default notificationRouter;
