import { Router } from 'express';
import contentRoutes from './contentRoutes';
import strategyRoutes from './strategyRoutes';
import memoryRoutes from './memoryRoutes';
import dashboardRoutes from './dashboardRoutes';
import { hindsightService } from '../services/hindsight/hindsightService';

const router = Router();

router.use('/content', contentRoutes);
router.use('/strategy', strategyRoutes);
router.use('/memory', memoryRoutes);
router.use('/dashboard', dashboardRoutes);

// Health & System status check
router.get('/health', (_req, res) => {
  const hindsightStatus = hindsightService.getStatus();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    hindsight: hindsightStatus,
    groqConfigured: Boolean(process.env.GROQ_API_KEY)
  });
});

export default router;
