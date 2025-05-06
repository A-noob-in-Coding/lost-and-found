import db from '../config/db.js';

// Get all categories
export const getAllCategories = async () => {
  try {
    // Modified to exclude the default category (id=1)
    const query = 'SELECT * FROM category WHERE category_id != 1 ORDER BY category';
    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error('Error in getAllCategories service:', error);
    throw error;
  }
};

// Get category by ID
export const getCategoryById = async (id) => {
  try {
    const query = 'SELECT * FROM category WHERE category_id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  } catch (error) {
    console.error('Error in getCategoryById service:', error);
    throw error;
  }
};

// Create a new category
export const createCategory = async ({ category }) => {
  try {
    // Start transaction
    await db.query('BEGIN');
    
    const query = 'INSERT INTO category (category) VALUES ($1) RETURNING *';
    const { rows } = await db.query(query, [category]);
    
    // Commit the transaction
    await db.query('COMMIT');
    
    return rows[0];
  } catch (error) {
    // Rollback in case of errors
    await db.query('ROLLBACK');
    
    // Check if the error is due to duplicate category (not duplicate ID)
    if (error.code === '23505' && error.constraint === 'category_category_key') {
      throw new Error('Category name already exists');
    }
    console.error('Error in createCategory service:', error);
    throw error;
  }
};

// Update an existing category
export const updateCategory = async (id, { category }) => {
  try {
    // Check if trying to modify the default category (id=1)
    if (id == 1) {
      return { error: true, message: "Cannot modify the default category" };
    }

    // Start transaction
    await db.query('BEGIN');
    
    const query = 'UPDATE category SET category = $1 WHERE category_id = $2 RETURNING *';
    const { rows } = await db.query(query, [category, id]);
    
    // Commit the transaction
    await db.query('COMMIT');
    
    return rows[0];
  } catch (error) {
    // Rollback in case of errors
    await db.query('ROLLBACK');
    
    console.error('Error in updateCategory service:', error);
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (id) => {
  try {
    // Check if trying to delete the default category (id=1)
    if (id == 1) {
      return { error: true, message: "Cannot delete the default category" };
    }

    // Start transaction
    await db.query('BEGIN');

    // Update items to use the default category (id=1) instead of deleting them
    await db.query(
      'UPDATE public.item SET category_id = 1 WHERE category_id = $1',
      [id]
    );

    // Delete the category itself
    const query = 'DELETE FROM public.category WHERE category_id = $1 RETURNING *';
    const { rows } = await db.query(query, [id]);
    
    // Commit the transaction
    await db.query('COMMIT');
    
    return rows[0];
  } catch (error) {
    // Rollback in case of errors
    await db.query('ROLLBACK');
    console.error('Error in deleteCategory service:', error);
    throw error;
  }
};
