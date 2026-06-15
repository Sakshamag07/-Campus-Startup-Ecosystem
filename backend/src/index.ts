import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
// 💡 Fixed: Restored .js extensions required by your node16 compiler configuration
import apiRoutes from './routes/apiRoutes.js'; 
import { errorHandler } from './middleware/errorHandler.js';
import { SocketService } from './services/socketService.js';
import prisma from './config/db.js';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// Setup Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log request URLs in dev mode
if (process.env.NODE_ENV !== 'production') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`📡 [API]: ${req.method} request received at ${req.url}`);
    next();
  });
}

// Health Check Route
app.get('/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'healthy',
      dbConnected: true,
      timestamp: new Date()
    });
  } catch (err) {
    res.status(500).json({
      status: 'degraded',
      dbConnected: false,
      error: 'Database connection failed'
    });
  }
});

// Bind API Routing
app.use('/api', apiRoutes);

// Centralized Error Handling boundary
app.use(errorHandler as any);

// Initialize Websocket Connections
SocketService.init(server);

// Boot up server
server.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`👉 Access REST endpoints at http://localhost:${PORT}/api`);
});

export { app, server };