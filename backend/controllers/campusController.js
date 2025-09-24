import * as campusService from '../service/campusService.js';

// Get all campuses
export const getAllCampuses = async (req, res) => {
  try {
    const campuses = await campusService.getAllCampuses();
    res.status(200).json(campuses);
  } catch (error) {
    console.error('Error in getAllCampuses controller:', error);
    res.status(500).json({ message: 'Error retrieving campuses', error: error.message });
  }
};

// Get campus by ID
export const getCampusById = async (req, res) => {
  try {
    const { id } = req.params;
    const campus = await campusService.getCampusById(id);
    
    if (!campus) {
      return res.status(404).json({ message: 'Campus not found' });
    }
    
    res.status(200).json(campus);
  } catch (error) {
    console.error('Error in getCampusById controller:', error);
    res.status(500).json({ message: 'Error retrieving campus', error: error.message });
  }
};

// Create a new campus
export const createCampus = async (req, res) => {
  try {
    const { name, location, code } = req.body;
    
    // Basic validation
    if (!name) {
      return res.status(400).json({ message: 'Campus name is required' });
    }
    
    // Check if campus already exists
    try {
      const checkQuery = await campusService.getAllCampuses();
      const exists = checkQuery.some(item => 
        item.name.toLowerCase() === name.toLowerCase() || 
        (code && item.code && item.code.toLowerCase() === code.toLowerCase())
      );
      
      if (exists) {
        return res.status(400).json({ message: 'Campus with this name or code already exists' });
      }
    } catch (checkError) {
      console.error('Error checking for existing campus:', checkError);
    }
    
    const newCampus = await campusService.createCampus({ name, location, code });
    res.status(201).json(newCampus);
  } catch (error) {
    console.error('Error in createCampus controller:', error);
    res.status(500).json({ message: 'Error creating campus', error: error.message });
  }
};

// Update an existing campus
export const updateCampus = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, code } = req.body;
    
    // Basic validation
    if (!name) {
      return res.status(400).json({ message: 'Campus name is required' });
    }
    
    const updatedCampus = await campusService.updateCampus(id, { name, location, code });
    
    if (!updatedCampus) {
      return res.status(404).json({ message: 'Campus not found' });
    }
    
    // Check if the returned result has an error flag
    if (updatedCampus.error === true) {
      return res.status(400).json({ message: updatedCampus.message });
    }
    
    res.status(200).json(updatedCampus);
  } catch (error) {
    console.error('Error in updateCampus controller:', error);
    res.status(500).json({ message: 'Error updating campus', error: error.message });
  }
};

// Delete a campus
export const deleteCampus = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await campusService.deleteCampus(id);
    
    if (!result) {
      return res.status(404).json({ message: 'Campus not found' });
    }
    
    // Check if the returned result has an error flag
    if (result.error === true) {
      return res.status(400).json({ message: result.message });
    }
    
    res.status(200).json({ message: 'Campus deleted successfully' });
  } catch (error) {
    console.error('Error in deleteCampus controller:', error);
    res.status(500).json({ message: 'Error deleting campus', error: error.message });
  }
};