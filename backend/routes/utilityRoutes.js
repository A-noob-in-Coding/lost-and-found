import { getAllCampus, getCategories, sendContactEmail } from "../controllers/utilityController.js";
import express from 'express';
const utilrouter = express.Router()

utilrouter.get('/categories', getCategories);
utilrouter.post('/contact', sendContactEmail);
utilrouter.get('/campus', getAllCampus)
export default utilrouter
