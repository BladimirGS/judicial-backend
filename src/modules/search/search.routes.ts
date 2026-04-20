import { Router } from 'express';
import { SearchController } from './controllers/search.controller';

const router = Router();

router.get('/', SearchController.search);
router.get('/filters', SearchController.getFormDataBuscador);
router.get('/export', SearchController.exportExcel);

export default router;