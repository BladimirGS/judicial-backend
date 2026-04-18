import { AnexoRepository } from "../repositories/anexo.repository";
import { AnexoCatalogosDTO } from "../dtos/anexo-catalogos.dto";
import { AddAnexosDTO } from "../dtos/add-anexos.dto";

export const AnexoService = {
    
    async getAnexoCatalogos(): Promise<AnexoCatalogosDTO> {
        return await AnexoRepository.getCatalogos();
    },

    async addAnexos(data: AddAnexosDTO) {
        // Aquí podrías validar si la Apelación existe antes de intentar guardar
        return await AnexoRepository.saveMultipleAnexos(data);
    }
};