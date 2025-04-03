import {
  createLostPostService,
  createFoundPostService,
  getLostPostService,
  updateLostPostService,
  deleteLostPostService,
  getFoundPostService,
  updateFoundPostService,
  deleteFoundPostService,
} from "../service/postService.js";

// Create a lost post
export const createLostPostController = async (req, res) => {
  const { rollno, title, location, description, image_url, category_id } = req.body;

  if (!rollno || !title || !location || !description || !image_url || !category_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const lostPost = await createLostPostService(rollno, title, location, description, image_url, category_id);
    return res.status(201).json({ message: "Lost post created successfully", lostPost });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a lost post by ID
export const getLostPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const lostPost = await getLostPostService(postId);
    if (!lostPost) {
      return res.status(404).json({ message: "Lost post not found" });
    }
    return res.json(lostPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update a lost post
export const updateLostPost = async (req, res) => {
  const { postId } = req.params;
  const { title, location, description, image_url, category_id } = req.body;

  try {
    const updatedPost = await updateLostPostService(postId, title, location, description, image_url, category_id);
    return res.json({ message: "Lost post updated successfully", updatedPost });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a lost post
export const deleteLostPost = async (req, res) => {
  const { postId } = req.params;

  try {
    await deleteLostPostService(postId);
    return res.json({ message: "Lost post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create a found post
export const createFoundPostController = async (req, res) => {
  const { rollno, title, location, description, image_url, category_id } = req.body;

  console.log(rollno, title, location, description, image_url, category_id);
  if (!rollno || !title || !location || !description || !image_url || !category_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const foundPost = await createFoundPostService(rollno, title, location, description, image_url, category_id);
    return res.status(201).json({ message: "Found post created successfully", foundPost });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a found post by ID
export const getFoundPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const foundPost = await getFoundPostService(postId);
    if (!foundPost) {
      return res.status(404).json({ message: "Found post not found" });
    }
    return res.json(foundPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update a found post
export const updateFoundPost = async (req, res) => {
  const { postId } = req.params;
  const { title, location, description, image_url, category_id } = req.body;

  try {
    const updatedPost = await updateFoundPostService(postId, title, location, description, image_url, category_id);
    return res.json({ message: "Found post updated successfully", updatedPost });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a found post
export const deleteFoundPost = async (req, res) => {
  const { postId } = req.params;

  try {
    await deleteFoundPostService(postId);
    return res.json({ message: "Found post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};