import express from "express";
import {
  userCreateLostPost,
  userDeleteLostPost,
  userGetLostPost,
  userCreateFoundPost,
  userDeleteFoundPost,
  userGetFoundPost,
} from "../controllers/postController.js";

const router = express.Router();

// Lost post routes for users
router.post("/lost", userCreateLostPost);
router.get("/lost/:postId", userGetLostPost);
router.delete("/lost/:postId", userDeleteLostPost);

// Found post routes for users
router.post("/found", userCreateFoundPost);
router.get("/found/:postId", userGetFoundPost);
router.delete("/found/:postId", userDeleteFoundPost);

export default router;