import { AnexoRepository } from "../repositories/anexo.repository";
import { AnexoCatalogosDTO } from "../dtos/anexo-catalogos.dto";
import { AddAnexosDTO } from "../dtos/add-anexos.dto";

export const AnexoService = {
    
    async getAnexoCatalogos(): Promise<AnexoCatalogosDTO> {
        return await AnexoRepository.getCatalogos();
    },

    async addAnexos(data: AddAnexosDTO) {
        return await AnexoRepository.saveMultipleAnexos(data);
    }
};