import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ResponseUtil } from '../core/utils/response.util';

export const validateDTO = (dtoClass: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Hacemos cast de req.query a any para que class-transformer no se queje
        const instance = plainToInstance(dtoClass, req.query as any); 
        
        // Validamos la instancia
        const errors = await validate(instance as object); // <--- Forzamos a object aquí

        // En validation.middleware.ts
        if (errors.length > 0) {
            const formattedErrors = errors.map(err => ({
                campo: err.property,
                errores: Object.values(err.constraints || {})
            }));

            // USAMOS EL UTIL:
            return ResponseUtil.validationError(res, formattedErrors);
        }

        next();
    };
};