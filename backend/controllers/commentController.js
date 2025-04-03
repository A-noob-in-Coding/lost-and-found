import { addFoundCommentService, addLostCommentService, deleteFoundCommentService, deleteLostCommentService } from "../service/commentService.js"

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
