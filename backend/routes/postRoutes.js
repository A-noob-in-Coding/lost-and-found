import express from "express";
import {
  createLostPostController,
  createFoundPostController,
  getLostPost,
  updateLostPost,
  deleteLostPost,
  getFoundPost,
  updateFoundPost,
  deleteFoundPost,
} from "../controllers/postController.js";

const router = express.Router();

// Lost post routes
router.post("/lost", createLostPostController);
router.get("/lost/:postId", getLostPost);
router.put("/lost/:postId", updateLostPost);
router.delete("/lost/:postId", deleteLostPost);

// Found post routes
router.post("/found", createFoundPostController);
router.get("/found/:postId", getFoundPost);
router.put("/found/:postId", updateFoundPost);
router.delete("/found/:postId", deleteFoundPost);

export default router;