import { AppDataSource } from "../../../config/data-source";
import { ApelacionParte } from "../../../database/entities/apelacion-parte.entity";
import { Apelacion } from "../../../database/entities/apelacion.entity";
import { CatApelacion } from "../../../database/entities/catalogo-apelacion.entity";
import { CatDelito } from "../../../database/entities/catalogo-delito.entity";
import { CatEtnia } from "../../../database/entities/catalogo-etnia.entity";
import { CatJuzgado } from "../../../database/entities/catalogo-juzgado.entity";
import { CatLocalidad } from "../../../database/entities/catalogo-localidad.entity";
import { CatMagistrado } from "../../../database/entities/catalogo-magistrado.entity";
import { CatMunicipio } from "../../../database/entities/catalogo-municipio.entity";
import { CatSexo } from "../../../database/entities/catalogo-sexo.entity";
import { DelitoRelacion } from "../../../database/entities/delito-relacion.entity";
import { Relacion } from "../../../database/entities/relacion.entity";
import { TipoApelacion } from "../../../database/entities/tipo-apelacion.entity";
import { TipoEscrito } from "../../../database/entities/tipo-escrito.entity";
import { ApelacionCatalogosDTO } from "../dtos/apelacion-catalogos.dto";
import { CreateApelacionDTO } from "../dtos/create-apelacion.dto";
import { ApelacionNativeRepository } from "./apelacion-native.repository";

export const ApelacionRepository = AppDataSource.getRepository(Apelacion).extend({
    
    async findFullByFolio(folioOficialia: string) {
        return this.findOne({
            where: { folioOficialia: folioOficialia },
            select: {
                id: true, folioOficialia: true, folioApelacion: true,
                expedienteCausa: true, fojas: true, esReposicion: true,
                fechaAuto: true, observaciones: true, asunto: true, lugarHechos: true
            },
            relations: {
                materia: true, tipoApelacion: true, tipoEscrito: true, catMagistrado: true,
                catJuzgado: true, municipio: true, localidad: true, etnia: true,
                relaciones: {
                    ofendido: { sexo: true, tipoParte: true },
                    procesado: { sexo: true, tipoParte: true },
                    delitoRelaciones: { delito: true }
                }
            }
        });
    },
    
    async getFormCatalogos(): Promise<ApelacionCatalogosDTO> {
        const manager = AppDataSource.manager;

        const folioTentativo = await ApelacionNativeRepository.calcularFolioTramite(manager);
        const materias = await ApelacionNativeRepository.getMaterias(manager);
        const tiposPartes = await ApelacionNativeRepository.getTiposPartes(manager);

        const queryConfig = {
            select: { id: true, descripcion: true } as any,
            where: { activo: true } as any
        };

        const [
            apelaciones, tiposApelaciones, tiposEscritos, juzgados, 
            magistrados, municipios, localidades, etnias, delitos, sexos
        ] = await Promise.all([
            manager.find(CatApelacion, queryConfig),
            manager.find(TipoApelacion, queryConfig),
            manager.find(TipoEscrito, queryConfig),
            manager.find(CatJuzgado, queryConfig),
            manager.find(CatMagistrado, queryConfig),
            manager.find(CatMunicipio, queryConfig),
            manager.find(CatLocalidad, queryConfig),
            manager.find(CatEtnia, queryConfig),
            manager.find(CatDelito, queryConfig),
            manager.find(CatSexo, queryConfig),
        ]);

        return {
            folioTentativo, materias, apelaciones, tiposApelaciones, tiposEscritos, juzgados, 
            magistrados, municipios, localidades, etnias, delitos, tiposPartes, sexos
        };
    },
    
    async getFormLocalidades(idMunicipio: number) {
        const manager = AppDataSource.manager;

        const localidades = await ApelacionNativeRepository.getLocalidades(manager, idMunicipio);

        return {
            localidades
        };
    },

    async createFullApelacion(data: CreateApelacionDTO) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const manager = AppDataSource.manager;

        const folioOficialia = await ApelacionNativeRepository.calcularFolioTramite(manager);

        try {
            // Guardar Apelación
            const nuevaApelacion = queryRunner.manager.create(Apelacion, {
                ...data,
                folioOficialia: folioOficialia,
                idSala: 1 
            });
            const apelacionGuardada = await queryRunner.manager.save(nuevaApelacion);

            // Procesar Relaciones
            if (data.relaciones?.length > 0) {
                for (const rel of data.relaciones) {

                    const prepararParte = (parte: any) => ({
                        nombre: parte.nombre,
                        idTipoParte: parte.idTipoParte,
                        idSexo: parte.idSexo,
                        direccion: parte.direccion || '',
                        idApelacion: apelacionGuardada.id,
                        _menorEdad: parte.menorEdad ? '1' : '0'
                    });

                    // Crear Parte Ofendido
                    const ofendido = await queryRunner.manager.save(
                        queryRunner.manager.create(ApelacionParte, prepararParte(rel.ofendido))
                    );

                    // Crear Parte Procesado
                    const procesado = await queryRunner.manager.save(
                        queryRunner.manager.create(ApelacionParte, prepararParte(rel.procesado))
                    );

                    // Crear la Relación
                    const nuevaRelacion = await queryRunner.manager.save(
                        queryRunner.manager.create(Relacion, {
                            idApelacion: apelacionGuardada.id,
                            idApelacionParteOfendido: ofendido.id,
                            idApelacionParteProcesado: procesado.id
                        })
                    );

                    // Crear Delitos vinculados
                    if (rel.delitoRelaciones?.length > 0) {
                        const delitos = rel.delitoRelaciones.map(dr => 
                            queryRunner.manager.create(DelitoRelacion, {
                                idDelito: dr.idDelito,
                                idRelacion: nuevaRelacion.id
                            })
                        );
                        await queryRunner.manager.save(delitos);
                    }
                }
            }

            await queryRunner.commitTransaction();
            return apelacionGuardada;

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
});