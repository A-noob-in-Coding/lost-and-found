import pool from "../config/db.js";

export const addFoundCommentService = async(rollNo,fPostID,comment)=>{
  try{
    const query = 'INSERT INTO foundpostcomment (f_post_id, rollno, "comment") VALUES ($1, $2, $3)';
    await pool.query(query,[fPostID,rollNo,comment]);
  }
  catch(error){
    console.log("error while posting found comment in user Service : ",error.message);
    throw new Error(error.message);
  }

}

export const addLostCommentService = async(rollNo,lPostID,comment)=>{
  try{
    const query = 'INSERT INTO lostpostcomment (l_post_id, rollno, "comment") VALUES ($1, $2, $3)'; 
    await pool.query(query,[lPostID,rollNo,comment]);
  }
  catch(error){
    console.log("error while posting lost comment in user Service : ",error.message);
    throw new Error(error.message);
  }
}

export const deleteLostCommentService = async(rollNo,lcommentID)=>{
  try{
    const query = 'DELETE FROM lostpostcomment WHERE l_comment_id = $1 AND rollno = $2;'
    await pool.query(query,[lcommentID,rollNo]);
  }catch(error){
    console.log("error while deleting lost comment ", error.message)
    throw new Error(error.message)
  }
}

export const deleteFoundCommentService = async(rollNo,fcommentID)=>{
  try{
    const query = 'DELETE FROM foundpostcomment WHERE f_comment_id = $1 AND rollno = $2;'
    await pool.query(query,[fcommentID,rollNo]);
  }catch(error){
    console.log("error while deleting found comment ", error.message)
    throw new Error(error.message)
  }
}