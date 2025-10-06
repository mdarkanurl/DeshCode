import express, { NextFunction, Request, Response } from "express";
import apiRouter from "./routers";
// import { prisma } from "./prisma";
import { CustomError } from "./utils/errors/app-error";
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router
app.use('/api', apiRouter);

// Health check
app.get('/api/health', async (req: Request, res: Response) => {
  let dbStatus = 'Disconnected';
  try {
    // await prisma.$connect();
    dbStatus = 'Connected';
  } catch (error) {
    dbStatus = 'Disconnected';
  }
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Welcome to Express leaderboard Backend API',
    version: '1.0.0',
    database: 'MySQL',
    endpoints: {
      leaderboard: '/api/leaderboards',
    }
  });
});

// Error handling
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).json({
    Success: false,
    Message: err.message,
    Data: null,
    Errors: null
  });
});

export default app;