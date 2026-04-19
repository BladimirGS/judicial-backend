import { Router } from 'express';
import { ApelacionController } from './controllers/apelacion.controller';
import { AnexoController } from './controllers/anexo.controller';

const router = Router();

router.get('/form-data', ApelacionController.getFormCatalogos);
router.get('/detail', ApelacionController.getByFolio);
router.post('/', ApelacionController.create);

router.get('/anexos/form-data', AnexoController.getAnexoCatalogos);

router.post('/anexos', AnexoController.addAnexos);

export default router;