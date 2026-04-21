import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateApelacionDTO } from '../dtos/create-apelacion.dto';
import { ResponseUtil } from '../../../core/utils/response.util';

export const validateApelacion = async (req: Request, res: Response, next: NextFunction) => {

};