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

    search: async (req: Request, res: Response) => {
        try {
            if (!SearchParamsDTO.hasAtLeastOneParam(req.query)) {
                return ResponseUtil.badRequest(res, 'Debe proporcionar al menos un criterio');
            }

            const data = await SearchService.search(req.query);
            return ResponseUtil.success(res, data);

        } catch (error) {
            console.log(error)
            return ResponseUtil.error(res, 'Error interno en la búsqueda');
        }
    },

    exportExcel: async (req: Request, res: Response) => {
        try {
            // 1. Obtenemos los datos de tu buscador
            const datos = await SearchService.search(req.query as any);

            if (!datos || datos.length === 0) {
                return res.status(404).json({ message: 'No hay datos para exportar' });
            }

            // 2. Definimos el nombre del archivo (dinámico o por defecto)
            let nombreArchivo = req.query.nombreArchivo 
                ? String(req.query.nombreArchivo) 
                : `Reporte_Apelaciones_${Date.now()}`;
            
            // Forzamos la extensión .xlsx si no la trae
            if (!nombreArchivo.endsWith('.xlsx')) {
                nombreArchivo += '.xlsx';
            }

            // 3. Generamos el buffer
            const buffer = await SearchService.generateApelacionesExcel(datos);

            // 4. Configuramos los Headers correctamente
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            // Las comillas alrededor del filename son cruciales para que no se pierda la extensión
            res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
            
            return res.status(200).send(buffer);

        } catch (error) {
            console.error('Error al exportar Excel:', error);
            return res.status(500).json({ message: 'Error interno al generar Excel' });
        }
    }
};