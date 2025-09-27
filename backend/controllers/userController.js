import { authenticateUserService, changePasswordService, doesUserExist, getPasswordUserService, getUserByRollNoService, hashPassword, registerUserService, getUserImageService, updateUserNameService, updateUserImageService, getUserByEmailService, authenticateAdminService } from "../service/userService.js";

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

export const authenticateAdmin = async (req, res) => {
  const { username, password } = req.body;
  if (!password || !username) {
    return res.status(400).json({ message: "All fields are required" })
  }
  const result = await authenticateAdminService(username, password)
  console.log(result)
  if (result) {
    return res.status(200).json({ message: "User logged in" })
  }
  else {
    return res.status(400).json({ message: "Invalid credentials" })
  }
}

export const registerUser = async (req, res) => {
  const { rollNo, email, name, password, campusID } = req.body;
  let imageFile = req.file

  if (!rollNo || !email || !name || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!imageFile) {
    imageFile = null
  }

  // Validate image file type
  if (imageFile && !ALLOWED_FILE_TYPES.includes(imageFile.mimetype)) {
    return res.status(400).json({ message: "Invalid file type. Only JPEG, PNG, and WEBP are allowed." });
  }

  // Validate file size
  if (imageFile && imageFile.size > MAX_FILE_SIZE) {
    return res.status(400).json({ message: "File size exceeds the 3MB limit." });
  }

  try {
    const newUser = await registerUserService(rollNo, email, name, password, imageFile, campusID);
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
    return res.status(404).json({ message: "Invalid credentials" });
  }
};

export const changePassword = async (req, res) => {
  const { email, password } = req.body

  try {
    await changePasswordService(email, password);
    return res.status(200).json({ message: "Password changed successfully" })
  }
  catch (error) {
    return res.status(500).json({ message: "Internal server error while changing password" })
  }
}

export const getUserImage = async (req, res) => {
  const { rollNo } = req.params;

  try {
    const imageUrl = await getUserImageService(rollNo);
    return res.json(imageUrl);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const checkUserByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required', exists: false });
  }

  try {
    // Use doesUserExist function which accepts email instead of getPasswordUserService
    const exists = await doesUserExist(email);
    return res.json({ exists: exists });
  } catch (error) {
    console.error('Error checking user by email:', error);
    return res.status(200).json({ exists: false });
  }
};

export const updateUserName = async (req, res) => {
  const { rollno, username } = req.body
  if (!rollno | !username) {
    return res.status(400).json({ message: "please provide all fields" })
  }
  try {
    await updateUserNameService(rollno, username)
    return res.status(200).json({ message: "username successfully changed" })
  }
  catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: "internal server error" })
  }
}

export const updateUserImage = async (req, res) => {
  const { rollno } = req.body;
  const imageFile = req.file;

  if (!rollno || !imageFile) {
    return res.status(400).json({ message: "Roll number and image file are required" });
  }

  // Validate image file type
  if (!ALLOWED_FILE_TYPES.includes(imageFile.mimetype)) {
    return res.status(400).json({ message: "Invalid file type. Only JPEG, PNG, and WEBP are allowed." });
  }

  // Validate file size
  if (imageFile.size > MAX_FILE_SIZE) {
    return res.status(400).json({ message: "File size exceeds the 3MB limit." });
  }
  try {
    const newImageUrl = await updateUserImageService(rollno, imageFile);
    return res.status(200).json({
      message: "Profile image updated successfully",
      image_url: newImageUrl
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getUserByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await getUserByEmailService(email);
    const userResponse = {
      email: user.email,
      name: user.name,
      rollno: user.rollno,
      image_url: user.image_url
    };
    return res.json({ message: "Email already exists!" });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
