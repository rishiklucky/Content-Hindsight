import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import apiRoutes from './routes';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// Middlewares
app.use(cors({
  origin: '*', // Allows local dev frontend from any port
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Mount API routes
app.use('/api', apiRoutes);

// Root greeting
app.get('/', (_req: Request, res: Response) => {
  res.json({
    app: 'ContentHindsight Backend API',
    tagline: 'Your content strategy remembers.',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      dashboard: '/api/dashboard',
      strategy: '/api/strategy',
      memory: '/api/memory',
      content: '/api/content'
    }
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: {
      message: err?.message || 'Internal server error occurred',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🧠 ContentHindsight Backend running on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`📡 Hindsight memory bank: active`);
  console.log(`⚡ Groq AI configured: ${Boolean(process.env.GROQ_API_KEY)}`);
  console.log(`===============================================`);
});

export default app;
