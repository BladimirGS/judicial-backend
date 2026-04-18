// src/modules/apelacion/apelacion.controller.ts
import { Request, Response } from 'express';
import { ApelacionService } from '../services/apelacion.service';
import { ResponseUtil } from '../../../core/utils/response.util';

export const ApelacionController = {

getByFolio: async (req: Request, res: Response) => {
        try {
            const { folio } = req.query; 

            if (!folio) {
                return ResponseUtil.badRequest(res, 'El folio es requerido');
            }

            const apelacion = await ApelacionService.getByFolio(String(folio));

            if (!apelacion) {
                return ResponseUtil.notFound(res, `No se encontró la apelación: ${folio}`);
            }

            return ResponseUtil.success(res, apelacion);
        } catch (error) {
            console.error('Error en getByFolio:', error);
            return ResponseUtil.error(res, 'Error al buscar apelación');
        }
    },
    
    getFormCatalogos: async (_req: Request, res: Response) => {
        try {
            const data = await ApelacionService.getFormCatalogos();
            return ResponseUtil.success(res, data, 'Catálogos cargados correctamente');
        } catch (error) {
            console.error('Error en getFormCatalogos:', error);
            return ResponseUtil.error(res, 'No se pudieron obtener los catálogos para el formulario');
        }
    },

    create: async (req: Request, res: Response) => {
        try {
            // En un futuro, aquí podrías validar el DTO con class-validator
            const nuevaApelacion = await ApelacionService.create(req.body);

            return ResponseUtil.created(
                res, 
                { id: nuevaApelacion.id, folio: nuevaApelacion.folioOficialia }, 
                'Apelación y relaciones registradas correctamente'
            );
        } catch (error) {
            console.error('Error en create:', error);
            return ResponseUtil.error(res, 'No se pudo completar el registro de la apelación');
        }
    }
};