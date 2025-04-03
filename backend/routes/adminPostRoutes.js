import express from "express";
import {
  adminGetLostPost,
  adminUpdateLostPost,
  adminDeleteLostPost,
  adminGetFoundPost,
  adminUpdateFoundPost,
  adminDeleteFoundPost,
} from "../controllers/postController.js";

const router = express.Router();

// Lost post routes for admins
router.get("/lost/:postId", adminGetLostPost);
router.put("/lost/:postId", adminUpdateLostPost);
router.delete("/lost/:postId", adminDeleteLostPost);

// Found post routes for admins
router.get("/found/:postId", adminGetFoundPost);
router.put("/found/:postId", adminUpdateFoundPost);
router.delete("/found/:postId", adminDeleteFoundPost);

export default router;