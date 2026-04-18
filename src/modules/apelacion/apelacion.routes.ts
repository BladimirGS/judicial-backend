import { Router } from 'express';
import { ApelacionController } from './controllers/apelacion.controller';
import { AnexoController } from './controllers/anexo.controller';
// import { AnexoController } from './anexo.controller';

const router = Router();

// Dominio de Apelaciones
router.get('/catalogos', ApelacionController.getFormCatalogos);
router.get('/buscar', ApelacionController.getByFolio);
router.post('/crear', ApelacionController.create);

// // Dominio de Anexos
router.get('/anexos/catalogos', AnexoController.getAnexoCatalogos);
router.post('/anexos/agregar', AnexoController.addAnexos);

export default router;