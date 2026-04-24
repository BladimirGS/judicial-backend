import { CatalogoBaseDTO } from "../dtos/apelacion-catalogos.dto";

export const mapCatalogo = (catalogo: any): CatalogoBaseDTO | null => {
    return catalogo ? { id: catalogo.id, descripcion: catalogo.descripcion } : null;
};

export const mapParte = (parte: any) => {
    return {
        id: parte?.id,
        nombre: parte?.nombre ?? null,
        direccion: parte?.direccion ?? null,
        menorEdad: Boolean(parte?.menorEdad) ?? false,
        sexo: parte?.sexo?.descripcion ?? null,
        tipoParte: parte?.tipoParte?.descripcion
    };
}