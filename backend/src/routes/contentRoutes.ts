import { Router } from 'express';
import { getContentList, getContentById, createContent } from '../controllers/contentController';

const router = Router();

router.get('/', getContentList);
router.get('/:id', getContentById);
router.post('/', createContent);

export default router;
