import { Router } from 'express';
import { SearchController } from './controllers/search.controller';
import { validateDTO } from '../../middlewares/validation.middleware';
import { SearchParamsDTO } from './dtos/search-params.dto';

const router = Router();

router.get('/filters', SearchController.getFormDataBuscador);
router.get('/', validateDTO(SearchParamsDTO), SearchController.search);

export default router;