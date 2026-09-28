import { Router } from 'express';
import { generateStrategy } from '../controllers/strategyController';

const router = Router();

router.post('/', generateStrategy);

export default router;
