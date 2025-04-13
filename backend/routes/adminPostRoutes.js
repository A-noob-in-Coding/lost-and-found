import express from "express";
import {
  adminUpdateLostPost,
  adminDeleteLostPost,
  adminUpdateFoundPost,
  adminDeleteFoundPost,
  getAdminPosts,
} from "../controllers/postController.js";
const router = express.Router();


router.get("/", getAdminPosts);

// Lost post routes for admins
router.put("/lost", adminUpdateLostPost);
router.delete("/lost", adminDeleteLostPost);

// Found post routes for admins

router.put("/found", adminUpdateFoundPost);
router.delete("/found", adminDeleteFoundPost);

export default router;