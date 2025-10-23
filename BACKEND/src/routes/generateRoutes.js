// backend/src/routes/generateRoutes.js
import express from 'express';
import { generateComponent } from '../controllers/generateController.js';

const router = express.Router();

// Defines the POST endpoint at /generate
router.post('/generate', generateComponent);

export default router;