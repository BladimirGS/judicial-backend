import { AppDataSource } from "../../../config/data-source";
import { CatSala } from "../../../database/entities/catalogo-sala.entity";
import { CatNomenclatura } from "../../../database/entities/catalogo-nomenclatura.entity";
import { TipoApelacion } from "../../../database/entities/tipo-apelacion.entity";
import { SearchCatalogosDTO } from "../dtos/search-catalogos.dto";
import { SearchParamsDTO } from "../dtos/search-params.dto";
import { Apelacion } from "../../../database/entities/apelacion.entity";
import { Relacion } from "../../../database/entities/relacion.entity";

export const SearchRepository = {
    async getSearchCatalogos(): Promise<SearchCatalogosDTO> {
        const queryConfig = {
            select: { id: true, descripcion: true } as any,
            where: { activo: true } as any
        };

        const [salas, nomenclaturas, tiposApelaciones] = await Promise.all([
            AppDataSource.getRepository(CatSala).find(queryConfig),
            AppDataSource.getRepository(CatNomenclatura).find(queryConfig),
            AppDataSource.getRepository(TipoApelacion).find(queryConfig),
        ]);

        return { salas, nomenclaturas, tiposApelaciones };
    },

    async searchApelaciones(params: SearchParamsDTO): Promise<Apelacion[]> {
        const query = AppDataSource.getRepository(Apelacion)
            .createQueryBuilder("apelacion")
            .leftJoinAndSelect("apelacion.sala", "sala")
            .leftJoinAndSelect("apelacion.nomenclatura", "nomenclatura")
            .leftJoinAndSelect("apelacion.tipoApelacion", "tipoApelacion")
            .leftJoinAndSelect("apelacion.anexos", "anexo")
            .leftJoinAndSelect("anexo.anexo", "catAnexo")
            .leftJoinAndSelect("apelacion.relaciones", "rel")
            .leftJoinAndSelect("rel.ofendido", "ofendido")
            .leftJoinAndSelect("ofendido.sexo", "oSexe")
            .leftJoinAndSelect("ofendido.tipoParte", "oTipo")
            .leftJoinAndSelect("rel.procesado", "procesado")
            .leftJoinAndSelect("procesado.sexo", "pSexe")
            .leftJoinAndSelect("procesado.tipoParte", "pTipo")
            .leftJoinAndSelect("rel.delitoRelaciones", "dr")
            .leftJoinAndSelect("dr.delito", "delito");

        // Filtros Dinámicos
        if (params.folioOficialia) {
            query.andWhere("apelacion.folioOficialia = :folioOficialia", { 
                folioOficialia: params.folioOficialia 
            });
        }
        if (params.folioApelacion) {
            query.andWhere("apelacion.folioApelacion = :folioApelacion", { 
                folioApelacion: params.folioApelacion 
            });
        }
        if (params.expedienteCausa) {
            query.andWhere("apelacion.expedienteCausa = :expedienteCausa", { 
                expedienteCausa: params.expedienteCausa 
            });
        }
        if (params.expedienteCausa) {
            query.andWhere("apelacion.expedienteCausa LIKE :causa", { causa: `%${params.expedienteCausa}%` });
        }
        if (params.idSala) {
            query.andWhere("sala.id = :idSala", { idSala: params.idSala });
        }
        if (params.idNomenclatura) {
            query.andWhere("nomenclatura.id = :idNom", { idNom: params.idNomenclatura });
        }
        if (params.idTipoApelacion) {
            query.andWhere("tipoApelacion.id = :idTipo", { idTipo: params.idTipoApelacion });
        }

        if (params.fechaInicio && params.fechaFin) {
            // Creamos objetos Date a partir de los strings (ej. "2023-12-20")
            const inicio = new Date(params.fechaInicio);
            const fin = new Date(params.fechaFin);

            // Sumamos un día a la fecha final para que el rango sea exclusivo
            // Así, si fin es '2023-12-20', capturará todo hasta el '2023-12-20 23:59:59'
            const diaSiguiente = new Date(fin);
            diaSiguiente.setDate(fin.getDate() + 1);

            query.andWhere(
                "apelacion.fechaHoraRecepcion >= :inicio AND apelacion.fechaHoraRecepcion < :finSiguiente", 
                { 
                    inicio: inicio, 
                    finSiguiente: diaSiguiente 
                }
            );
        } else if (params.fechaInicio) {
            const inicio = new Date(params.fechaInicio);
            query.andWhere("apelacion.fechaHoraRecepcion >= :inicio", { 
                inicio: inicio
            });
        } else if (params.fechaFin) {
            const fin = new Date(params.fechaFin);
            const diaSiguiente = new Date(fin);
            diaSiguiente.setDate(fin.getDate() + 1);

            query.andWhere("apelacion.fechaHoraRecepcion < :finSiguiente", { 
                finSiguiente: diaSiguiente 
            });
        }

        if (params.nombreParte) {
            query.andWhere(qb => {
                const sub = qb.subQuery()
                    .select("1")
                    .from(Relacion, "rel2")
                    .leftJoin("rel2.ofendido", "o2")
                    .leftJoin("rel2.procesado", "p2")
                    .where("rel2.idApelacion = apelacion.id")
                    .andWhere("(o2.nombre LIKE :parte OR p2.nombre LIKE :parte)")
                    .getQuery();
                return `EXISTS ${sub}`;
            }).setParameter("parte", `%${params.nombreParte}%`);
        }

        return await query.getMany();
    }
};