import express from "express";
import {
  userCreateLostPost,
  userDeleteLostPost,
  userGetLostPost,
  userCreateFoundPost,
  userDeleteFoundPost,
  userGetFoundPost,
  getPostData,
  getPostsByRollNo,
  getUnverifiedPostsByRollNo,
} from "../controllers/postController.js";
import upload from "../config/mutler.js";

const router = express.Router();


// Lost post routes for users
router.post('/lost', upload.single("image"), userCreateLostPost);
router.post("/lost", userCreateLostPost);
router.get("/lost", userGetLostPost);
router.delete("/lost/:postId", userDeleteLostPost);
// This line is critical: `upload.single("image")` must be before the controller

// Found post routes for users
router.post('/found', upload.single("image"), userCreateFoundPost);
router.post("/found", userCreateFoundPost);
router.get("/found", userGetFoundPost);
router.delete("/found/:postId", userDeleteFoundPost);
router.get('/getPostData',getPostData)
router.get('/rollno/:rollno', getPostsByRollNo);
router.get('/unverified/rollno/:rollno', getUnverifiedPostsByRollNo);
export default router;