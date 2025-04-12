// misc services

import pool from "../config/db.js"
export const getCategoriesService = async() =>{
  try{  
    const query = 'select * from category'
    const result = await pool.query(query)
    return result.rows
  }
  catch(error){
    console.log("error fetching categories")
    throw error
  }
}