import { Router } from 'express';
import { SearchController } from './controllers/search.controller';

const router = Router();

// GET /api/v1/search/catalogos
router.get('/catalogos', SearchController.getFormDataBuscador);
router.get('/', SearchController.search);

export default router;