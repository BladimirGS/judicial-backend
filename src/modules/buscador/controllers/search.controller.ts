import { Request, Response } from 'express';
import { SearchService } from '../services/search.service';
import { ResponseUtil } from '../../../core/utils/response.util';

export const SearchController = {
    getFormDataBuscador: async (_req: Request, res: Response) => {
        try {
            const data = await SearchService.getFormDataBuscador();
            return ResponseUtil.success(res, data, 'Catálogos para buscador cargados');
        } catch (error) {
            console.error('ERROR_SEARCH_CATALOGS:', error);
            return ResponseUtil.error(res, 'Error al obtener los filtros del buscador');
        }
    },

    search: async (req: Request, res: Response) => {
        try {
            // Obtenemos los filtros desde req.query
            const data = await SearchService.search(req.query);
            return ResponseUtil.success(res, data);
        } catch (error) {
            console.error('SEARCH_ERROR:', error);
            return ResponseUtil.error(res, 'Error al ejecutar la búsqueda');
        }
    }
};