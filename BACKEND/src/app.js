// backend/src/app.js
import express from 'express';
import cors from 'cors';
import generateRoutes from './routes/generateRoutes.js';

const app = express();

// Middleware
app.use(cors({
  // Add both your deployed and local frontend URLs to the guest list
  origin: ['https://web-genie-omega.vercel.app/', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// API Routes
// All routes from generateRoutes will be prefixed with /api
app.use('/api', generateRoutes);

export default app;