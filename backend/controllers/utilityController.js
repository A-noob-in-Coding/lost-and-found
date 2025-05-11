import { getCategoriesService, sendContactEmailService } from "../service/utitilityService.js";

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
};

export const sendContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await sendContactEmailService(name, email, message);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in sendContactEmail controller:', error);
    return res.status(500).json({ message: error.message });
  }
};