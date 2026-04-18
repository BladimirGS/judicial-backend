export interface CatalogoBaseDTO {
    id: number;
    descripcion: string;
}

export interface ApelacionCatalogosDTO {
    materias: CatalogoBaseDTO[];
    apelaciones: CatalogoBaseDTO[];
    tiposApelaciones: CatalogoBaseDTO[];
    tiposEscritos: CatalogoBaseDTO[];
    juzgados: CatalogoBaseDTO[];
    municipios: CatalogoBaseDTO[];
    localidades: CatalogoBaseDTO[];
    etnias: CatalogoBaseDTO[];
    delitos: CatalogoBaseDTO[];
}