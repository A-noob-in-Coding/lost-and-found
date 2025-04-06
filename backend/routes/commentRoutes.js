import express from "express"
import { addFoundComment, addLostComment, deleteFoundComment, deleteLostComment, getAllFoundComments, getAllLostComments } from "../controllers/commentController.js"
const commentRoutes = express.Router()

commentRoutes.post('/addlostcomment',addLostComment)
commentRoutes.post('/addfoundcomment',addFoundComment)
commentRoutes.delete('/deletelostcomment',deleteLostComment)
commentRoutes.delete('/deletefoundcomment',deleteFoundComment)
commentRoutes.get('/foundcomments', getAllFoundComments)
commentRoutes.get('/lostcomments', getAllLostComments)
export default commentRoutes
