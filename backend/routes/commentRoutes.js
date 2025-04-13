import express from "express"
import { addFoundComment, addLostComment, deleteFoundComment, deleteLostComment, getUserAllFoundComments,getUserAllLostComments,getAdminAllFoundComments,getAdminAllLostComments, verifyFoundComment, verifyLostComment, getAdminAllComments, deleteAdminFoundComment, deleteAdminLostComment} from "../controllers/commentController.js"
const commentRoutes = express.Router()

commentRoutes.post('/addlostcomment',addLostComment)
commentRoutes.post('/addfoundcomment',addFoundComment)
commentRoutes.get('/verifylostcomment',verifyLostComment)
commentRoutes.get('/verifyfoundcomment',verifyFoundComment)
commentRoutes.delete('/deletelostcomment',deleteLostComment)
commentRoutes.delete('/deletefoundcomment',deleteFoundComment)
commentRoutes.delete('/deleteadminlostcomment',deleteAdminLostComment)
commentRoutes.delete('/deleteadminfoundcomment',deleteAdminFoundComment)
commentRoutes.get('/user/foundcomments', getUserAllFoundComments)
commentRoutes.get('/user/lostcomments', getUserAllLostComments)
commentRoutes.get('/admin/foundcomments', getAdminAllFoundComments)
commentRoutes.get('/admin/lostcomments', getAdminAllLostComments)
commentRoutes.get('/getcomments',getAdminAllComments)
export default commentRoutes
