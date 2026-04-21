import { Router } from 'express';
import { ApelacionController } from './controllers/apelacion.controller';
import { AnexoController } from './controllers/anexo.controller';
import { validateApelacion } from './middleware/apelacion.middleware';

const router = Router();

router.post('/', validateApelacion, ApelacionController.create);
router.get('/form-data', ApelacionController.getFormCatalogos);
router.get('/detail', ApelacionController.getByFolio);

router.post('/anexos', AnexoController.addAnexos);
router.get('/anexos/form-data', AnexoController.getAnexoCatalogos);

export default router;