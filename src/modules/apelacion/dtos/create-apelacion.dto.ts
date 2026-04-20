export interface CreateParteDTO {
    nombre: string;
    direccion?: string;
    menorEdad: boolean;
    idTipoParte: number;
    idSexo: number;
}

export interface CreateRelacionDTO {
    ofendido: CreateParteDTO;
    procesado: CreateParteDTO;
    delitoRelaciones: Array<{ idDelito: number }>;
}

export interface CreateApelacionDTO {
    idMateria: number;
    idNomenclatura: number;
    idApelacion: number;
    idTipoApelacion: number;
    idTipoEscrito: number;
    idJuzgado: number;
    idMunicipio: number;
    idLocalidad: number;
    idEtnia: number;
    folioOficialia: string;
    folioApelacion?: string;
    expedienteCausa: string;
    fojas: number;
    fechaAuto: Date;
    lugarHechos: string;
    asunto: string;
    observaciones?: string;
    esReposicion: boolean;
    relaciones: CreateRelacionDTO[];
}