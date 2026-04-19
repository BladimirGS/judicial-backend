import { Router } from 'express';
import apelacionRoutes from '../modules/apelacion/apelacion.routes';
import searchRoutes from '../modules/search/search.routes';
import { authSimulado } from '../core/middlewares/auth.middleware';

const router = Router();

// Registro de submódulos
router.use('/apelaciones',authSimulado, apelacionRoutes);
router.use('/search', authSimulado, searchRoutes);

export default router;