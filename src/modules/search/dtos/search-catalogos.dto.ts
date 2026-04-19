import { CatalogoBaseDTO } from "../../apelacion/dtos/apelacion-catalogos.dto";

export interface SearchCatalogosDTO {
    salas: CatalogoBaseDTO[];
    nomenclaturas: CatalogoBaseDTO[];
    tiposApelaciones: CatalogoBaseDTO[];
    tiposEscritos: CatalogoBaseDTO[];
}