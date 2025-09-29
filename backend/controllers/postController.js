import {
  createLostPostService,
  createFoundPostService,
  getLostPostService,
  deleteLostPostService,
  getFoundPostService,
  updateFoundPostService,
  deleteFoundPostService,
  getAdminPostsService,
  updateLostPostService,
  getPostDataService,
  getPostsByRollNoService,
  getUnverifiedPostsByRollNoService
} from "../service/postService.js";

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 5MB


// User Controllers

// Create a lost post
export const userCreateLostPost = async (req, res) => {
  try {
    const { rollno, title, location, description, category_id, campusID } = req.body;
    let imageFile = req.file; // Get uploaded image from multer

    if (!rollno || !title || !location || !description || !category_id || !campusID) {
      return res.status(400).json({ message: "All fields including image are required" });
    }

    if (!imageFile) {
      imageFile = null;
    }

    // Validate image file type
    if (imageFile && !ALLOWED_FILE_TYPES.includes(imageFile.mimetype)) {
      return res.status(400).json({ message: "Invalid file type. Only JPEG, PNG, and WEBP are allowed." });
    }

    // Validate file size
    if (imageFile && imageFile.size > MAX_FILE_SIZE) {
      return res.status(400).json({ message: "File size exceeds the 3MB limit." });
    }

    // Save post in database with image URL
    const lostPost = await createLostPostService(rollno, title, location, description, imageFile, category_id, campusID);

    return res.status(201).json({ message: "Lost post created successfully", lostPost });
  } catch (error) {
    console.error("Error creating lost post:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Delete a lost post
export const userDeleteLostPost = async (req, res) => {
  const { postId } = req.params;

  try {
    await deleteLostPostService(postId);
    return res.json({ message: "Lost post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a lost post
export const userGetLostPost = async (req, res) => {


  try {
    const lostPost = await getLostPostService(true);
    if (!lostPost) {
      return res.status(404).json({ message: "Lost post not found" });
    }
    return res.json(lostPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create a found post
export const userCreateFoundPost = async (req, res) => {
  try {
    const { rollno, title, location, description, category_id, campusID } = req.body;
    let imageFile = req.file; // Get uploaded image from multer

    if (!imageFile) {
      imageFile = null
    }

    if (!rollno || !title || !location || !description || !category_id || !campusID) {
      return res.status(400).json({ message: "All fields including image are required" });
    }


    // Validate image file type
    if (imageFile && !ALLOWED_FILE_TYPES.includes(imageFile.mimetype)) {
      return res.status(400).json({ message: "Invalid file type. Only JPEG, PNG, and WEBP are allowed." });
    }

    // Validate file size
    if (imageFile && imageFile.size > MAX_FILE_SIZE) {
      return res.status(400).json({ message: "File size exceeds the 3MB limit." });
    }

    // Save post in database with image URL
    const lostPost = await createFoundPostService(rollno, title, location, description, imageFile, category_id, campusID);

    return res.status(201).json({ message: "Found post created successfully", lostPost });
  } catch (error) {
    console.error("Error creating found post:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Delete a found post
export const userDeleteFoundPost = async (req, res) => {
  const { postId } = req.params;

  try {
    await deleteFoundPostService(postId);
    return res.json({ message: "Found post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a found post
export const userGetFoundPost = async (req, res) => {


  try {
    const foundPost = await getFoundPostService(true);
    if (!foundPost) {
      return res.status(404).json({ message: "Found post not found" });
    }
    return res.json(foundPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Admin Controllers
// Get a lost post
export const getAdminPosts = async (req, res) => {
  try {
    const result = await getAdminPostsService(false);
    if (!result) {
      return res.status(404).json({ message: "Lost post not found" });
    }
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Delete a lost post
export const adminDeleteLostPost = async (req, res) => {
  const postId = req.query.id;

  try {
    await deleteLostPostService(postId);
    return res.json({ message: "Lost post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a found post
export const adminGetFoundPost = async (req, res) => {
  try {
    const foundPost = await getFoundPostService(false);
    if (!foundPost) {
      return res.status(404).json({ message: "Found post not found" });
    }
    return res.json(foundPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update a found post
export const adminUpdateFoundPost = async (req, res) => {
  const post_id = req.query.id
  if (!post_id) {
    return res.status(400).json({ message: "must provide post id" })
  }
  try {
    await updateFoundPostService(post_id);
    return res.json({ message: "Found post updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a found post
export const adminDeleteFoundPost = async (req, res) => {
  const postId = req.query.id
  if (!postId) {
    return res.status(400).json({ message: "must provide post id" })
  }
  try {

    await deleteFoundPostService(postId);
    return res.json({ message: "Found post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const adminUpdateLostPost = async (req, res) => {
  const post_id = req.query.id
  if (!post_id) {
    return res.status(400).json({ message: "must provide post id" })
  }
  try {
    await updateLostPostService(post_id);
    return res.json({ message: "Found post updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPostData = async (req, res) => {
  try {
    const result = await getPostDataService();
    return res.status(200).json(result)
  }
  catch (error) {
    console.log("error in getPostdata controller" + error.message)
    return res.status(500).json({ message: "internal server error" })
  }
}

// Get posts by roll number (user's own posts)
export const getPostsByRollNo = async (req, res) => {
  try {
    const { rollno } = req.params;

    if (!rollno) {
      return res.status(400).json({ message: "Roll number is required" });
    }

    const posts = await getPostsByRollNoService(rollno);
    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getPostsByRollNo controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get unverified posts by roll number
export const getUnverifiedPostsByRollNo = async (req, res) => {
  try {
    const { rollno } = req.params;

    if (!rollno) {
      return res.status(400).json({ message: "Roll number is required" });
    }

    const posts = await getUnverifiedPostsByRollNoService(rollno);
    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getUnverifiedPostsByRollNo controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
