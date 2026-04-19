import { Request, Response } from 'express';
import { SearchService } from '../services/search.service';
import { ResponseUtil } from '../../../core/utils/response.util';
import { SearchParamsDTO } from '../dtos/search-params.dto';

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

    // En search.controller.ts
    search: async (req: Request, res: Response) => {
        try {
            if (!SearchParamsDTO.hasAtLeastOneParam(req.query)) {
                // USAMOS EL UTIL:
                return ResponseUtil.badRequest(res, 'Debe proporcionar al menos un criterio');
            }

            const data = await SearchService.search(req.query);
            return ResponseUtil.success(res, data);

        } catch (error) {
            return ResponseUtil.error(res, 'Error interno en la búsqueda');
        }
    }
};