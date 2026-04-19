import { Router } from 'express';
import { SearchController } from './controllers/search.controller';

const router = Router();

router.get('/filters', SearchController.getFormDataBuscador);
router.get('/', SearchController.search);

export default router;