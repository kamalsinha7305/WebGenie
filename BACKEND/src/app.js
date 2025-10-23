// backend/src/app.js
import express from 'express';
import cors from 'cors';
import generateRoutes from './routes/generateRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
// All routes from generateRoutes will be prefixed with /api
app.use('/api', generateRoutes);

export default app;