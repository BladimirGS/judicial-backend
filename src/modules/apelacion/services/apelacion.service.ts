import { ApelacionRepository } from "../repositories/apelacion.repository";
import { ApelacionDetalleDTO } from "../dtos/apelacion-detalle.dto";
import { ApelacionCatalogosDTO } from "../dtos/apelacion-catalogos.dto";
import { CreateApelacionDTO } from "../dtos/create-apelacion.dto";
import { mapCatalogo, mapParte } from "../utils/apelacion.mapper";

export const ApelacionService = {

    async getByFolio(folioOficialia: string): Promise<ApelacionDetalleDTO | null> {
        const entidad = await ApelacionRepository.findFullByFolio(folioOficialia);

        if (!entidad) return null;

        return {
            id: entidad.id,
            folioOficialia: entidad.folioOficialia,
            folioApelacion: entidad.folioApelacion,
            expedienteCausa: entidad.expedienteCausa,
            fojas: entidad.fojas,
            esReposicion: entidad.esReposicion,
            fechaAuto: entidad.fechaAuto,
            observaciones: entidad.observaciones,
            asunto: entidad.asunto,
            lugarHechos: entidad.lugarHechos,

            // Mapeo de catàlogos
            materia: mapCatalogo(entidad.materia),
            tipoApelacion: mapCatalogo(entidad.tipoApelacion),
            tipoEscrito: mapCatalogo(entidad.tipoEscrito),
            juzgadoOrigen: mapCatalogo(entidad.catJuzgado),
            municipio: mapCatalogo(entidad.municipio),
            localidad: mapCatalogo(entidad.localidad),
            etnia: mapCatalogo(entidad.etnia),
            magistrado: mapCatalogo(entidad.catMagistrado),

            // Relacion de partes
            relaciones: entidad.relaciones?.map(r => ({
                id: r.id,
                ofendido: mapParte(r.ofendido),
                procesado: mapParte(r.procesado),
                delitosRelacion: r.delitoRelaciones?.map(dr => ({
                    id: dr.id,
                    delito: mapCatalogo(dr.delito)
                })) ?? []
            })) ?? []
        };
    },

    async getFormCatalogos(): Promise<ApelacionCatalogosDTO> {
        return await ApelacionRepository.getFormCatalogos();
    },

    async getFormLocalidades(idMunicipio: number) {
        return await ApelacionRepository.getFormLocalidades(idMunicipio);
    },

    async create(data: CreateApelacionDTO) {
        return await ApelacionRepository.createFullApelacion(data);
    }
};
