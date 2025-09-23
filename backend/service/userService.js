import bcrypt from 'bcrypt'
import pool from "../config/db.js"
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

export const hashPassword = async (password) =>{
  const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound);
    return hashedPassword;
}



export const registerUserService = async (rollNo, email, name, password, image) => {
  const client = await pool.connect(); // Get a client from the pool
  try {
    await client.query('BEGIN'); // Start transaction
    let image_url = ""
    if(image){
      image_url = await uploadToCloudinary(image)
    }

    const hashedPassword = await hashPassword(password);
    const query = 'INSERT INTO "User" (rollNo, email, name, password, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const result = await client.query(query, [rollNo, email, name, hashedPassword, image_url]);

    if (result && result.rows) {
      await client.query('COMMIT'); // Commit transaction
      return result.rows[0].password; // return the first row (new user)
    } else {
      throw new Error('Failed to create user');
    }
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback transaction on error
    console.error('Error registering user:', error);
    throw new Error(error.message);
  } finally {
    client.release(); // Release the client back to the pool
  }
};

// Function to get user by rollNo
export const getUserByRollNoService = async (rollNo) => {
  try {
    const query = 'SELECT * FROM "User" WHERE rollNo = $1';
    const result = await pool.query(query, [rollNo]);

    // Ensure that result.rows exists before accessing it
    if (result && result.rows && result.rows.length > 0) {
      return result.rows[0]; // return the user object
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error(error.message);
  }
};

export const doesUserExist = async(email)=>{
  try{
    const query = 'select count(*) from "User" where email = $1'
    const result = await pool.query(query,[email])
    if(result && result.rows && result.rows.length > 0) {
      return parseInt(result.rows[0].count) > 0;
    }
    return false;
  }
  catch(error){
    console.log("Error while checking existence of user : ",error.message)
    throw new Error(error.message)
  }
}

export const getPasswordUserService = async(rollNo) =>{
  try{
    const query = 'Select password from "User" where rollno = $1';
    const result = await pool.query(query,[rollNo]);
    if (result && result.rows && result.rows.length > 0) {
      return result.rows[0].password; // return the user object
    } else {
      throw new Error('User not found');
    }
  }
  catch(error){
    console.error('Error fetching user password:', error);
    throw new Error(error.message);
  }
}

export const authenticateAdminService = async(username,password) =>{
  try{
    if(password !== process.env.ADMIN_PASS || username !== process.env.ADMIN_USER){    
      return false;
    }
    else{
      return true;
    }
  }catch(error){
    console.log("Error authenticating user");
  }
}

export const authenticateUserService = async(rollNo,password) =>{
  try{
    const pass = await getPasswordUserService(rollNo);
    const result = await bcrypt.compare(password,pass);
    if(result){
      return true;
    }
    else{
      return false;
    }
  }
  catch(error){
    console.error('Error authenticating user :', error);
    throw new Error(error.message);
  }
};

export const changePasswordService = async(email,password) =>{
  try{
    console.log(email)
    console.log(password)
    const result = doesUserExist(email)
    if(result){
      const newPass =  await hashPassword(password)
      const query = 'Update "User" set password = $1 where email = $2';
      await pool.query(query,[newPass,email])
      return
    } 
    else{
      throw new Error("User does not exist");
    }
  }
  catch(error){
    console.log("Error while changing password : ",error.message);
    throw new Error(error.message);
  }
}

export const getUserImageService = async(rollNo) =>{
  try{
    const query = 'Select image_url from "User" where rollno = $1';
    const result = await pool.query(query,[rollNo]);
    if (result && result.rows && result.rows.length > 0) {
      return result.rows[0].image_url; // return the user object
    } else {
      throw new Error('User not found');
    }
  }
  catch(error){
    console.error('Error fetching user password:', error);
    throw new Error(error.message);
  }
}

export const updateUserNameService = async(rollno,username) =>{
  try{
    const query = 'UPDATE "User" SET name = $1 WHERE rollno = $2'
    await pool.query(query,[username,rollno])
  }
  catch(error){
    console.log("error while changing username"+error.message)
    throw new Error(error.message)
  }
}

export const updateUserImageService = async (rollno, image) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get the old image URL first to delete it later
    const oldImageQuery = 'SELECT image_url FROM "User" WHERE rollno = $1';
    const oldImageResult = await client.query(oldImageQuery, [rollno]);
    const oldImageUrl = oldImageResult.rows[0]?.image_url;

    // Upload new image to Cloudinary
    const newImageUrl = await uploadToCloudinary(image);

    // Update user's image URL in database
    const updateQuery = 'UPDATE "User" SET image_url = $1 WHERE rollno = $2 RETURNING image_url';
    const result = await client.query(updateQuery, [newImageUrl, rollno]);

    if (result && result.rows && result.rows.length > 0) {
      // Delete old image from Cloudinary if it exists
      if (oldImageUrl) {
        await deleteFromCloudinary(oldImageUrl);
      }

      await client.query('COMMIT');
      return result.rows[0].image_url;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating user image:', error);
    throw new Error(error.message);
  } finally {
    client.release();
  }
};

export const getUserByEmailService = async(email) => {
  try {
    const query = 'SELECT * FROM "User" WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result && result.rows && result.rows.length > 0) {
      return result.rows[0]; // return the user object
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw new Error(error.message);
  }
};