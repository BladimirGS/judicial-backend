import { SearchRepository } from "../repositories/search.repository";
import { SearchCatalogosDTO } from "../dtos/search-catalogos.dto";
import { SearchParamsDTO } from "../dtos/search-params.dto";

export const SearchService = {
    async getFormDataBuscador(): Promise<SearchCatalogosDTO> {
        return await SearchRepository.getSearchCatalogos();
    },

    async search(params: SearchParamsDTO) {
        const resultados = await SearchRepository.searchApelaciones(params);

        return resultados.map(apelacion => ({
            id: apelacion.id,
            folioOficialia: apelacion.folioOficialia,
            folioApelacion: apelacion.folioApelacion,
            folioApelacionAnterior: apelacion.folioApelacion,
            folioOficio: apelacion.folioOficio,
            
            fojas: apelacion.fojas,
            expedienteAcumulado: apelacion.expedienteAcumulado,
            esReposicion: apelacion.esReposicion,
            expedienteCausa: apelacion.expedienteCausa,
            fechaAuto: apelacion.fechaAuto,
            fechaHoraRecepcion: apelacion.fechaHoraRecepcion,
            fechaHoraIngresoJuz: apelacion.fechaHoraIngresoJuz,
            observaciones: apelacion.observaciones,
            asunto: apelacion.asunto,
            lugarHechos: apelacion.lugarHechos,

            // Aplanamos catálogos
            sala: apelacion.sala?.descripcion ?? null,
            salaAnterior: apelacion.sala?.descripcion ?? null,
            juzgadoOrigen: apelacion.catJuzgado?.descripcion ?? null,
            magistradoAsignado: apelacion.catMagistrado?.descripcion ?? null,
            nomenclatura: apelacion.nomenclatura?.descripcion ?? null,
            tipoApelacion: apelacion.tipoApelacion?.descripcion ?? null,
            tipoEscrito: apelacion.tipoEscrito?.descripcion ?? null,

            // Mapeo de anexos
            anexos: apelacion.anexos?.map(a => ({
                id: a.id,
                descripcion: a.idAnexo > 0 ? a.anexo?.descripcion : a.otroAnexo,
                esValor: Boolean(a.esValor),
                monto: a.monto ?? null
            })) ?? [],

            // Mapeo plano de partes
            partes: apelacion.relaciones?.flatMap(r => {
                const lista = [];
                if (r.ofendido) lista.push({ tipo: 'OFENDIDO', nombre: r.ofendido.nombre, sexo: r.ofendido.sexo?.descripcion });
                if (r.procesado) lista.push({ tipo: 'PROCESADO', nombre: r.procesado.nombre, sexo: r.procesado.sexo?.descripcion });
                return lista;
            }) ?? []
        }));
    }
};