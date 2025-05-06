import * as categoryService from '../service/categoryService.js';

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error in getAllCategories controller:', error);
    res.status(500).json({ message: 'Error retrieving categories', error: error.message });
  }
};

// Get category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(200).json(category);
  } catch (error) {
    console.error('Error in getCategoryById controller:', error);
    res.status(500).json({ message: 'Error retrieving category', error: error.message });
  }
};

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { category } = req.body;
    
    // Basic validation
    if (!category) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    // Check if category already exists
    try {
      const checkQuery = await categoryService.getAllCategories();
      const exists = checkQuery.some(item => item.category.toLowerCase() === category.toLowerCase());
      
      if (exists) {
        return res.status(400).json({ message: 'Category already exists' });
      }
    } catch (checkError) {
      console.error('Error checking for existing category:', checkError);
    }
    
    // Only pass the category name to the service
    const newCategory = await categoryService.createCategory({ category });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error in createCategory controller:', error);
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

// Update an existing category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    
    // Basic validation
    if (!category) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    const updatedCategory = await categoryService.updateCategory(id, { category });
    
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if the returned result has an error flag
    if (updatedCategory.error === true) {
      return res.status(400).json({ message: updatedCategory.message });
    }
    
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error in updateCategory controller:', error);
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await categoryService.deleteCategory(id);
    
    if (!result) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if the returned result has an error flag
    if (result.error === true) {
      return res.status(400).json({ message: result.message });
    }
    
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error in deleteCategory controller:', error);
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};
