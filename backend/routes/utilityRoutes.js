import { getCategories, sendContactEmail } from "../controllers/utilityController.js";
import express from 'express';
const Utilrouter = express.Router()

Utilrouter.get('/categories',getCategories);
Utilrouter.post('/contact', sendContactEmail);

export default Utilrouter