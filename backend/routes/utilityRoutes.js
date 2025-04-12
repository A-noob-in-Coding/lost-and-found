import { getCategories } from "../controllers/utilityController.js";
import express from 'express';
const Utilrouter = express.Router()

Utilrouter.get('/categories',getCategories);

export default Utilrouter