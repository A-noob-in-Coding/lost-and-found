import { addFoundCommentService, addLostCommentService } from "../service/commentService.js"

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