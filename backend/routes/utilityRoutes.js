import { getCatagories } from "../controllers/utilityController.js";
import express from 'express';
const Utilrouter = express.Router()

Utilrouter.get('/catagories',getCatagories);

export default Utilrouter