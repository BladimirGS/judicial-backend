import { Router } from 'express';
import apelacionRoutes from '../modules/apelacion/apelacion.routes';
import searchRoutes from '../modules/buscador/search.routes';

const router = Router();

// Registro de submódulos
router.use('/apelaciones', apelacionRoutes);
router.use('/search', searchRoutes);

export default router;