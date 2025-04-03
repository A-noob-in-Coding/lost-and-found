import express from "express"
import { addFoundComment, addLostComment } from "../controllers/commentController.js"
const commentRoutes = express.Router()

commentRoutes.post('/addlostcomment',addLostComment)
commentRoutes.post('/addfoundcomment',addFoundComment)

export default commentRoutes