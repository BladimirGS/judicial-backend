export interface AnexoItemDTO {
    idCatAnexo: number;
    fojas: number;
    observaciones?: string;
}

export interface AddAnexosDTO {
    idApelacion: number;
    anexos: AnexoItemDTO[];
}