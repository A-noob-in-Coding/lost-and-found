import { addFoundCommentService, addLostCommentService, deleteFoundCommentService, deleteLostCommentService, getAllFoundCommentsService, getAllLostCommentsService, verifyFoundCommentService, verifyLostCommentService, getAdminAllCommentsService, deleteAdminFoundCommentService, deleteAdminLostCommentService, deleteUserCommentByTextService, getUserCommentsService} from "../service/commentService.js"

export const addLostComment = async(req,res) =>{
  const {lpostId,rollNo,comment} = req.body
  try{
    if(!lpostId || !rollNo , !comment){
      return res.status(400).json({message:"please provide all fields"})
    }
    
    await addLostCommentService(rollNo,lpostId,comment);
    return res.status(200).json({message:"Comment added successfully"})
  }
  catch(error){
    console.log("error while adding lost comment in commment Controller : ",error.message);
    return res.status(400).json({message:"internal server error"})
  }
}

export const addFoundComment = async(req,res) =>{
  const {fpostId,rollNo,comment} = req.body
  try{
    if(!fpostId || !rollNo , !comment){
      return res.status(400).json({message:"please provide all fields"})
    }
    await addFoundCommentService(rollNo,fpostId,comment);
    return res.status(200).json({message:"Comment added successfully"})
  }
  catch(error){
    console.log("error while adding found comment in commment Controller : ",error.message);
    return res.status(400).json({message:"internal server error"})
  }
}

export const deleteAdminFoundComment = async(req,res) =>{
  const f_comment_id = req.query.id
  try{
    if(!f_comment_id){
      return res.status(400).json({message:"please provide all fields"})
    } 
    await deleteAdminFoundCommentService(f_comment_id)
    return res.status(200).json({message:"comment deleted successfully"})
    
  } 
  catch(error){
    return res.status(500).json({message:"internal server error"})
  } 
}

export const deleteAdminLostComment = async(req,res) =>{
  const l_comment_id = req.query.id
  try{
    if(!l_comment_id){
      return res.status(400).json({message:"please provide all fields"})
    }
    await deleteAdminLostCommentService(l_comment_id)
    return res.status(200).json({message:"comment deleted successfully"})
    
  } 
  catch(error){
    return res.status(500).json({message:"internal server error"})
  } 
}
export const deleteFoundComment = async(req,res) =>{
  const { f_comment_id , rollNo} = req.body
  try{
    if(!f_comment_id || !rollNo){
      return res.status(400).json({message:"please provide all fields"})
    } 
    await deleteFoundCommentService(rollNo,f_comment_id)
    return res.status(200).json({message:"comment deleted successfully"})
    
  } 
  catch(error){
    return res.status(500).json({message:"internal server error"})
  } 
}

export const deleteLostComment = async(req,res) =>{
  const { l_comment_id , rollNo} = req.body
  try{
    if(!l_comment_id || !rollNo){
      return res.status(400).json({message:"please provide all fields"})
    }
    await deleteLostCommentService(rollNo,l_comment_id)
    return res.status(200).json({message:"comment deleted successfully"})
    
  } 
  catch(error){
    return res.status(500).json({message:"internal server error"})
  } 
}

export const getAdminAllFoundComments = async (req, res) => {
  try {
    const comments = await getAllFoundCommentsService(false);
    return res.status(200).json(comments);
  } catch (error) {
    console.log("error while getting found comments in controller: ", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

export const getAdminAllLostComments = async (req, res) => {
  try {
    const comments = await getAllLostCommentsService(false);
    return res.status(200).json(comments);
  } catch (error) {
    console.log("error while getting lost comments in controller: ", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}
export const getUserAllFoundComments = async (req, res) => {
  try {
    const comments = await getAllFoundCommentsService(true);
    return res.status(200).json(comments);
  } catch (error) {
    console.log("error while getting found comments in controller: ", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

export const getUserAllLostComments = async (req, res) => {
  try {
    const comments = await getAllLostCommentsService(true);
    return res.status(200).json(comments);
  } catch (error) {
    console.log("error while getting lost comments in controller: ", error.message);
    return res.status(500).json({ message: "internal server error" });
  }
}

export const verifyLostComment = async(req,res) =>{
  const l_comment_id = req.query.id
  try{
    await verifyLostCommentService(l_comment_id)
    return res.status(200).json({message:"successfully marked as verfied"}) 
  }
  catch(error){
    return res.status(500).json({message:error.message})
  }
}

export const verifyFoundComment = async(req,res) =>{
  const f_comment_id = req.query.id
  try{
    await verifyFoundCommentService(f_comment_id)
    return res.status(200).json({message:"successfully marked as verfied"})
  }
  catch(error){
    return res.status(500).json({message:error.message})
  }
}

export const getAdminAllComments = async(req,res) =>{
  try{
    const result = await getAdminAllCommentsService()
    return res.status(200).json(result)

  } 
  catch(error){
    return res.status(500).json({message:error.message})
  }
}

export const deleteUserCommentByText = async (req, res) => {
  const { rollNo, comment, type } = req.body;
  
  try {
    // Input validation
    if (!rollNo || !comment || !type) {
      return res.status(400).json({ message: "Please provide rollNo, comment text, and type (lost/found)" });
    }
    
    if (!['lost', 'found'].includes(type.toLowerCase())) {
      return res.status(400).json({ message: "Type must be either 'lost' or 'found'" });
    }

    await deleteUserCommentByTextService(rollNo, comment, type);
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.log("Error in deleteUserCommentByText controller:", error.message);
    if (error.message === 'Comment not found') {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserComments = async (req, res) => {
  try {
    const { rollno } = req.params;

    if (!rollno) {
      return res.status(400).json({ message: "Roll number is required" });
    }

    const comments = await getUserCommentsService(rollno);
    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error in getUserComments controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

