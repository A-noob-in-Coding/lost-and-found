import { getCatagoriesService } from "../service/utitilityService.js";

export const getCatagories = async(req,res) =>{
  try{
    const catagories = await getCatagoriesService();
    if(catagories){
      return res.status(200).json(catagories)
    }
    else{
      return res.status(400).json({message:"error fetching catagories"})
    }
  }
  catch(error){
    console.log(error.message)
    return res.status(500).json({message : error.message})
  }
}