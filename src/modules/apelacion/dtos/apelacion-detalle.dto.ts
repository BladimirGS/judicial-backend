import { CatalogoBaseDTO } from "./apelacion-catalogos.dto";

export interface RelacionDetalleDTO {
    id: number;
    ofendido: {
        id: number;
        nombre: string | null;
        direccion: string | null;
        menorEdad: boolean | null;
        sexo: string | null;
        tipoParte: string | null;
    };
    procesado: {
        id: number;
        nombre: string | null;
        direccion: string | null;
        menorEdad: boolean | null;
        sexo: string | null;
        tipoParte: string | null;
    };
    delitosRelacion: Array<{
        id: number;
        nombreDelito: CatalogoBaseDTO | null;
    }>;
}

export interface ApelacionDetalleDTO {
    id: number;
    folioOficialia: string;
    folioApelacion: string | null;
    expedienteCausa: string;
    fojas: number;
    esReposicion: boolean;
    fechaAuto: Date;
    observaciones: string;
    asunto: string;
    lugarHechos: string;
    materia: CatalogoBaseDTO | null;
    tipoApelacion: CatalogoBaseDTO | null;
    tipoEscrito: CatalogoBaseDTO | null;
    juzgadoOrigen: CatalogoBaseDTO | null;
    municipio: CatalogoBaseDTO | null;
    localidad: CatalogoBaseDTO | null;
    etnia: CatalogoBaseDTO | null;
    magistrado: CatalogoBaseDTO | null;
    relaciones: RelacionDetalleDTO[];
}