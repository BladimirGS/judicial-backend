import { ApelacionRepository } from "../repositories/apelacion.repository";
import { ApelacionDetalleDTO } from "../dtos/apelacion-detalle.dto";
import { ApelacionCatalogosDTO } from "../dtos/apelacion-catalogos.dto";
import { CreateApelacionDTO } from "../dtos/create-apelacion.dto";

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

            // MAPEO DE CATÁLOGOS COMO OBJETOS
            materia: entidad.materia ? { 
                id: entidad.materia.id, 
                descripcion: entidad.materia.descripcion 
            } : null,

            tipoApelacion: entidad.tipoApelacion ? { 
                id: entidad.tipoApelacion.id, 
                descripcion: entidad.tipoApelacion.descripcion 
            } : null,

            tipoEscrito: entidad.tipoEscrito ? { 
                id: entidad.tipoEscrito.id, 
                descripcion: entidad.tipoEscrito.descripcion 
            } : null,

            juzgadoOrigen: entidad.catJuzgado ? { 
                id: entidad.catJuzgado.id, 
                descripcion: entidad.catJuzgado.descripcion 
            } : null,

            municipio: entidad.municipio ? { 
                id: entidad.municipio.id, 
                descripcion: entidad.municipio.descripcion 
            } : null,

            localidad: entidad.localidad ? { 
                id: entidad.localidad.id, 
                descripcion: entidad.localidad.descripcion 
            } : null,

            etnia: entidad.etnia ? { 
                id: entidad.etnia.id, 
                descripcion: entidad.etnia.descripcion 
            } : null,

            // Relaciones (El mapeo interno de ofendido/procesado ya incluía IDs)
            relaciones: entidad.relaciones?.map(r => ({
                id: r.id,
                ofendido: {
                    id: r.ofendido?.id,
                    nombre: r.ofendido?.nombre ?? null,
                    direccion: r.ofendido?.direccion ?? null,
                    menorEdad: Boolean(r.ofendido?.menorEdad) ?? false,
                    sexo: r.ofendido?.sexo?.descripcion ?? null,
                    tipoParte: r.ofendido?.tipoParte?.descripcion ?? null
                },
                procesado: {
                    id: r.procesado?.id,
                    nombre: r.procesado?.nombre ?? null,
                    direccion: r.procesado?.direccion ?? null,
                    menorEdad: Boolean(r.procesado?.menorEdad) ?? false,
                    sexo: r.procesado?.sexo?.descripcion ?? null,
                    tipoParte: r.procesado?.tipoParte?.descripcion ?? null
                },
                delitosRelacion: r.delitoRelaciones?.map(dr => ({
                    id: dr.id,
                    nombreDelito: entidad.municipio ? { 
                        id: entidad.municipio.id, 
                        descripcion: entidad.municipio.descripcion 
                    } : null,
                })) ?? []
            })) ?? []
        };
    },

    async getFormCatalogos(): Promise<ApelacionCatalogosDTO> {
        // Delegamos la carga masiva al repositorio
        return await ApelacionRepository.getFormCatalogos();
    },

    async create(data: CreateApelacionDTO) {
        // Podrías agregar lógica de negocio extra aquí antes de guardar
        return await ApelacionRepository.createFullApelacion(data);
    }
};
