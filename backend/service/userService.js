import bcrypt from 'bcrypt'
import pool from "../config/db.js"
import { uploadToCloudinary } from '../config/cloudinary.js';

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
    if(result){
      return true
    }
    else{
      return false
    }
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