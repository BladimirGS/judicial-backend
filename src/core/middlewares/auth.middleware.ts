import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response.util';

export const authSimulado = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];

    if (token === '1234') {
        next();
    } else {
        return ResponseUtil.error(res, 'No autorizado: Token inválido', 401);
    }
};