import { getCategoriesService } from "../service/utitilityService.js";

export const getCategories = async(req,res) =>{
  try{
    const catagories = await getCategoriesService();
    if(catagories){
      return res.status(200).json(catagories)
    }
    else{
      return res.status(400).json({message:"error fetching categories"})
    }
  }
  catch(error){
    console.log(error.message)
    return res.status(500).json({message : error.message})
  }
}