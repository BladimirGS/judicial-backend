import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateApelacionDTO } from '../dtos/create-apelacion.dto';
import { ResponseUtil } from '../../../core/utils/response.util';

export const validateApelacion = async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(CreateApelacionDTO, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
        const detalle = errors.map(e => ({
            campo: e.property,
            errores: Object.values(e.constraints ?? {})
        }));
        return ResponseUtil.validationError(res, detalle);
    }

    req.body = dto;
    next();
};