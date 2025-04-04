import { authenticateUserService, changePasswordService, getPasswordUserService, getUserByRollNoService,hashPassword,registerUserService } from "../service/userService.js";

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB


export const registerUser = async (req, res) => {
  const { rollNo, email, name, password } = req.body;
  let imageFile = req.file

  if (!rollNo || !email || !name || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if(!imageFile){
    imageFile = null
  }

  // Validate image file type
  if (imageFile &&!ALLOWED_FILE_TYPES.includes(imageFile.mimetype)) {
    return res.status(400).json({ message: "Invalid file type. Only JPEG, PNG, and WEBP are allowed." });
  }

  // Validate file size
  if (imageFile && imageFile.size > MAX_FILE_SIZE) {
    return res.status(400).json({ message: "File size exceeds the 3MB limit." });
  }

  try {
    const newUser = await registerUserService(rollNo, email, name, password, imageFile);
    return res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getUserByRollNo = async (req, res) => {
  const { rollNo } = req.params;

  try {
    const user = await getUserByRollNoService(rollNo);
    return res.json(user);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};


export const authenticateUser = async (req, res) => {
  const { rollno, password } = req.body; // Ensure destructuring works correctly
  try {
    const result = await authenticateUserService(rollno, password);
    if (result) {
      return res.status(200).json({ message: "User logged in" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log("failed");
    return res.status(404).json({ message: error.message });
  }
};

export const changePassword = async(req,res) =>{
  const {email, password} = req.body
  try{
    await changePasswordService(email,password);
    return res.status(200).json({message:"Password changed successfully"})
  }
  catch(error){
    return res.status(500).json({message:"Internal server error while changing password"})
  }
}
