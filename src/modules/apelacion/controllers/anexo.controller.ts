import { Request, Response } from 'express';
import { AnexoService } from '../services/anexo.service';
import { ResponseUtil } from '../../../core/utils/response.util';

export const AnexoController = {
    
    getAnexoCatalogos: async (_req: Request, res: Response) => {
        try {
            const data = await AnexoService.getAnexoCatalogos();
            return ResponseUtil.success(res, data, 'Catálogos de anexos obtenidos');
        } catch (error) {
            console.error('ERROR_ANEXO_CATALOGOS:', error);
            return ResponseUtil.error(res, 'Error al obtener catálogos de anexos');
        }
    },

    addAnexos: async (req: Request, res: Response) => {
        try {
            const { idApelacion, anexos } = req.body;

            // Validación rápida de presencia
            if (!idApelacion || !anexos || anexos.length === 0) {
                return ResponseUtil.badRequest(res, 'ID de apelación y lista de anexos son requeridos');
            }

            const data = await AnexoService.addAnexos(req.body);
            
            return ResponseUtil.created(res, data, 'Anexos agregados correctamente');
        } catch (error) {
            console.error('ERROR_ADD_ANEXOS:', error);
            return ResponseUtil.error(res, 'No se pudieron registrar los anexos');
        }
    }
};