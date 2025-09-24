import express from 'express';
import * as campusController from '../controllers/campusController.js';

const router = express.Router();

// CRUD routes for campuses
router.get('/', campusController.getAllCampuses);
router.get('/:id', campusController.getCampusById);
router.post('/', campusController.createCampus);
router.put('/:id', campusController.updateCampus);
router.delete('/:id', campusController.deleteCampus);

export default router;