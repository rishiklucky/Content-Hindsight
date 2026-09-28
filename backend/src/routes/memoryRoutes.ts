import { Router } from 'express';
import {
  getAllMemories,
  recallMemories,
  retainMemory,
  deleteMemory,
  resetMemories
} from '../controllers/memoryController';

const router = Router();

router.get('/', getAllMemories);
router.post('/recall', recallMemories);
router.post('/retain', retainMemory);
router.delete('/:id', deleteMemory);
router.post('/reset', resetMemories);

export default router;
