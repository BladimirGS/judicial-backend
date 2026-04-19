import { AppDataSource } from "../../../config/data-source";
import { ApelacionParte } from "../../../database/entities/apelacion-parte.entity";
import { Apelacion } from "../../../database/entities/apelacion.entity";
import { CatApelacion } from "../../../database/entities/catalogo-apelacion.entity";
import { CatDelito } from "../../../database/entities/catalogo-delito.entity";
import { CatEtnia } from "../../../database/entities/catalogo-etnia.entity";
import { CatJuzgado } from "../../../database/entities/catalogo-juzgado.entity";
import { CatLocalidad } from "../../../database/entities/catalogo-localidad.entity";
import { CatMagistrado } from "../../../database/entities/catalogo-magistrado.entity";
import { CatMateria } from "../../../database/entities/catalogo-materia.entity";
import { CatMunicipio } from "../../../database/entities/catalogo-municipio.entity";
import { DelitoRelacion } from "../../../database/entities/delito-relacion.entity";
import { Relacion } from "../../../database/entities/relacion.entity";
import { TipoApelacion } from "../../../database/entities/tipo-apelacion.entity";
import { TipoEscrito } from "../../../database/entities/tipo-escrito.entity";
import { ApelacionCatalogosDTO } from "../dtos/apelacion-catalogos.dto";
import { CreateApelacionDTO } from "../dtos/create-apelacion.dto";

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
                materia: true, tipoApelacion: true, tipoEscrito: true,
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
        // Definimos las entidades y sus repositorios
        const repoMateria = AppDataSource.getRepository(CatMateria);
        const repoApelacion = AppDataSource.getRepository(CatApelacion);
        const repoTipoApel = AppDataSource.getRepository(TipoApelacion);
        const repoTipoEscr = AppDataSource.getRepository(TipoEscrito);
        const repoJuzgado = AppDataSource.getRepository(CatJuzgado);
        const repoMagistrado = AppDataSource.getRepository(CatMagistrado);
        const repoMunicipio = AppDataSource.getRepository(CatMunicipio);
        const repoLocalidad = AppDataSource.getRepository(CatLocalidad);
        const repoEtnia = AppDataSource.getRepository(CatEtnia);
        const repoDelito = AppDataSource.getRepository(CatDelito);

        const queryConfig = {
            select: { id: true, descripcion: true } as any,
            where: { activo: true } as any
        };

        // Ejecución en paralelo
        const [
            materias, apelaciones, tiposApelaciones, tiposEscritos,
            juzgados, magistrados, municipios, localidades, etnias, delitos
        ] = await Promise.all([
            repoMateria.find(queryConfig),
            repoApelacion.find(queryConfig),
            repoTipoApel.find(queryConfig),
            repoTipoEscr.find(queryConfig),
            repoJuzgado.find(queryConfig),
            repoMagistrado.find(queryConfig),
            repoMunicipio.find(queryConfig),
            repoLocalidad.find(queryConfig),
            repoEtnia.find(queryConfig),
            repoDelito.find(queryConfig),
        ]);

        return {
            materias, apelaciones, tiposApelaciones, tiposEscritos,
            juzgados, magistrados, municipios, localidades, etnias, delitos
        };
    },

    async createFullApelacion(data: CreateApelacionDTO) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Guardar Apelación
            const nuevaApelacion = queryRunner.manager.create(Apelacion, {
                ...data,
                idSala: 1 
            });
            const apelacionGuardada = await queryRunner.manager.save(nuevaApelacion);

            // 2. Procesar Relaciones
            if (data.relaciones?.length > 0) {
                for (const rel of data.relaciones) {
                    
                    // --- CORRECCIÓN AQUÍ: Normalizamos los datos de las partes ---
                    const prepararParte = (parte: any) => ({
                        ...parte,
                        idApelacion: apelacionGuardada.id,
                        // Si direccion no viene, mandamos string vacío
                        direccion: parte.direccion,
                        // Si menorEdad es null/undefined, mandamos false. !! convierte a boolean.
                        menorEdad: !!parte.menorEdad 
                    });

                    // Crear Parte Ofendido
                    const ofendido = await queryRunner.manager.save(
                        queryRunner.manager.create(ApelacionParte, prepararParte(rel.ofendido))
                    );

                    // Crear Parte Procesado
                    const procesado = await queryRunner.manager.save(
                        queryRunner.manager.create(ApelacionParte, prepararParte(rel.procesado))
                    );

                    // 3. Crear la unión (Relación)
                    const nuevaRelacion = await queryRunner.manager.save(
                        queryRunner.manager.create(Relacion, {
                            idApelacion: apelacionGuardada.id,
                            idApelacionParteOfendido: ofendido.id,
                            idApelacionParteProcesado: procesado.id
                        })
                    );

                    // 4. Crear Delitos vinculados
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