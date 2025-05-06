import db from '../config/db.js';

// Get all categories
export const getAllCategories = async () => {
  try {
    const query = 'SELECT * FROM category ORDER BY category';
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
    // Start transaction
    await db.query('BEGIN');

    // Delete related comments from lostpost
    await db.query(
      'DELETE FROM public.lostpostcomment WHERE l_post_id IN (SELECT lpost_id FROM public.lostpost WHERE item_id IN (SELECT item_id FROM public.item WHERE category_id = $1))',
      [id]
    );

    // Delete related comments from foundpost
    await db.query(
      'DELETE FROM public.foundpostcomment WHERE f_post_id IN (SELECT f_post_id FROM public.foundpost WHERE item_id IN (SELECT item_id FROM public.item WHERE category_id = $1))',
      [id]
    );

    // Delete related lostposts
    await db.query(
      'DELETE FROM public.lostpost WHERE item_id IN (SELECT item_id FROM public.item WHERE category_id = $1)',
      [id]
    );

    // Delete related foundposts
    await db.query(
      'DELETE FROM public.foundpost WHERE item_id IN (SELECT item_id FROM public.item WHERE category_id = $1)',
      [id]
    );

    // Delete related items
    await db.query(
      'DELETE FROM public.item WHERE category_id = $1',
      [id]
    );

    // Finally delete the category itself
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
