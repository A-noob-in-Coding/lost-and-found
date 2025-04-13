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

// if flag is true send verified comments, else unverified comments
export const getAllFoundCommentsService = async (flag) => {
  let is_verified
  if(flag){
    is_verified = true
  }
  else{
    is_verified = false
  }
  try {
    const query = `
      SELECT fc.f_comment_id, fc.f_post_id, fc.comment, fc.rollno, u.name, u.email, fp.created_at, i.title, i.description, i.location
      FROM foundpostcomment fc
      JOIN "User" u ON fc.rollno = u.rollno
      JOIN foundpost fp ON fc.f_post_id = fp.f_post_id
      JOIN item i ON fp.item_id = i.item_id
      where fc.is_verified = $1
      ORDER BY fp.created_at DESC
    `;
    const result = await pool.query(query,[is_verified]);
    return result.rows;
  } catch (error) {
    console.log("error while getting found comments in service: ", error.message);
    throw new Error(error.message);
  }
}

// if flag is true send verified comments, else unverified comments
export const getAllLostCommentsService = async (flag) => {
  let is_verified
  if(flag){
    is_verified = true
  }
  else{
    is_verified = false
  }
  try {
    const query = `
      SELECT lc.l_comment_id, lc.l_post_id, lc.comment, lc.rollno, u.name, u.email, lp.created_at
      FROM lostpostcomment lc
      JOIN "User" u ON lc.rollno = u.rollno
      JOIN lostpost lp ON lc.l_post_id = lp.lpost_id
      where lc.is_verified = $1
      ORDER BY lp.created_at DESC
    `;
    const result = await pool.query(query,[is_verified]);
    return result.rows;
  } catch (error) {
    console.log("error while getting lost comments in service: ", error.message);
    throw new Error(error.message);
  }
}

export const verifyLostCommentService = async(lcommentID) =>{
  try{
    const query = 'UPDATE lostpostcomment SET is_verified = true where l_comment_id = $1'
    await pool.query(query,[lcommentID])
    return 
  }
  catch(error){
    console.log("error marking lost comment"+error.message)
    throw new Error(error.message)
  }
}

export const verifyFoundCommentService = async(fcommentID) =>{
  try{
    const query = 'UPDATE foundpostcomment SET is_verified = true where f_comment_id = $1'
    await pool.query(query,[fcommentID])
    return 
  }
  catch(error){
    console.log("error marking lost comment"+error.message)
    throw new Error(error.message)
  }
}

export const getAdminAllCommentsService = async() =>{
  try{
    const query = "SELECT l_comment_id AS comment_id, comment FROM lostpostcomment WHERE is_verified = false UNION ALL SELECT f_comment_id AS comment_id, comment FROM foundpostcomment WHERE is_verified = false"
    const result = await pool.query(query,[])
    return result.rows
  }
  catch(error){
    console.log(error.message)
    throw new Error(error.message)

  }
}