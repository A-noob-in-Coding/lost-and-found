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
  getPostData,
} from "../controllers/postController.js";

const postRouter = express.Router();

// Lost post routes
postRouter.post("/lost", createLostPostController);
postRouter.get("/lost", getLostPost);
postRouter.put("/lost/:postId", updateLostPost);
postRouter.delete("/lost/:postId", deleteLostPost);

// Found post routes
postRouter.post("/found", createFoundPostController);
postRouter.get("/found", getFoundPost);
postRouter.put("/found/:postId", updateFoundPost);
postRouter.delete("/found/:postId", deleteFoundPost);
postRouter.get('/getPostsData',getPostData);

export default postRouter;