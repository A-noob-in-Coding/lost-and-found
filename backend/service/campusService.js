import db from '../config/db.js';

// Get all campuses
export const getAllCampuses = async () => {
  try {
    const result = await db.query(
      'SELECT id, name, location, code, created_at, updated_at FROM campuses ORDER BY name ASC'
    );
    return result.rows;
  } catch (error) {
    console.error('Error in getAllCampuses service:', error);
    throw error;
  }
};

// Get campus by ID
export const getCampusById = async (id) => {
  try {
    const result = await db.query(
      'SELECT id, name, location, code, created_at, updated_at FROM campuses WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in getCampusById service:', error);
    throw error;
  }
};

// Create a new campus
export const createCampus = async (campusData) => {
  try {
    const { name, location, code } = campusData;
    
    const result = await db.query(
      `INSERT INTO campuses (name, location, code) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, location, code, created_at, updated_at`,
      [name, location || null, code || null]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error in createCampus service:', error);
    throw error;
  }
};

// Update an existing campus
export const updateCampus = async (id, campusData) => {
  try {
    const { name, location, code } = campusData;
    
    // First check if campus exists
    const existingCampus = await getCampusById(id);
    if (!existingCampus) {
      return null;
    }
    
    // Check for duplicate name or code (excluding current campus)
    const duplicateCheck = await db.query(
      'SELECT id FROM campuses WHERE (name = $1 OR ($2 IS NOT NULL AND code = $2)) AND id != $3',
      [name, code, id]
    );
    
    if (duplicateCheck.rows.length > 0) {
      return { error: true, message: 'Campus with this name or code already exists' };
    }
    
    const result = await db.query(
      `UPDATE campuses 
       SET name = $1, location = $2, code = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4 
       RETURNING id, name, location, code, created_at, updated_at`,
      [name, location || null, code || null, id]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error in updateCampus service:', error);
    throw error;
  }
};

// Delete a campus
export const deleteCampus = async (id) => {
  try {
    // First check if campus exists
    const existingCampus = await getCampusById(id);
    if (!existingCampus) {
      return null;
    }
    
    // Check if campus is being used by any users
    const usersCheck = await db.query(
      'SELECT id FROM users WHERE campus_id = $1 LIMIT 1',
      [id]
    );
    
    if (usersCheck.rows.length > 0) {
      return { error: true, message: 'Cannot delete campus. It is currently assigned to users.' };
    }
    
    // Check if campus is being used in any posts (if such a relationship exists)
    // You might want to add this check based on your database schema
    
    await db.query('DELETE FROM campuses WHERE id = $1', [id]);
    return { success: true };
  } catch (error) {
    console.error('Error in deleteCampus service:', error);
    throw error;
  }
};