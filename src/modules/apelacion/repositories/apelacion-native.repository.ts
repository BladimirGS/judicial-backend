import { EntityManager, In } from "typeorm";
import { CatMateria } from "../../../database/entities/catalogo-materia.entity";
import { TipoParte } from "../../../database/entities/tipo-parte.entity";
import { CatLocalidad } from "../../../database/entities/catalogo-localidad.entity";

export class ApelacionNativeRepository {
    // Simula PA_SEL_PCF_CAT_CboMateriasSalas
    static async getMaterias(manager: EntityManager) {
        return await manager.find(CatMateria, {
            select: ["id", "descripcion"],
            where: {
                activo: true,
                id: In([5, 6])
            },
            order: { descripcion: "ASC" }
        });
    }

    // Simula PA_SEL_PCF_CAT_CboPartes
    static async getTiposPartes(manager: EntityManager) {
        return await manager.find(TipoParte, {
            select : ["id", "descripcion"],
            where: {
                activo: true,
                materia: "P"
            }
        })
    }

    // Simula PA_SEL_PCF_CAT_CboPartes
    static async getLocalidades(manager: EntityManager, idMunicipio: number) {
        return await manager.find(CatLocalidad, {
            select : ["id", "descripcion"],
            where: {
                activo: true,
                idMunicipio: idMunicipio
            }
        })
    }

    // Simula PA_INS_PCF_FolioTramite
    static async calcularFolioTramite(manager: EntityManager): Promise<string> {
        const anio = new Date().getFullYear().toString();
        const result = await manager.query(`
            SELECT MAX(CAST(LEFT(FolioOficialia, 4) AS INT)) as maximo 
            FROM OFA_Apelaciones 
            WHERE Activo = 1 AND RIGHT(FolioOficialia, 4) = @0
        `, [anio]);

        const siguiente = (result[0]?.maximo || 0) + 1;
        return `${siguiente.toString().padStart(4, '0')}/${anio}`;
    }


    // Simula PA_SEL_FolioNomenclaturaToca
    static async calcularFolioExpediente(
        manager: EntityManager, 
        idSala: number, 
        idNomenclatura: number
    ): Promise<string> {
        const anio = new Date().getFullYear().toString();

        const result = await manager.query(`
            SELECT MAX(CAST(LEFT(FolioApelacion, 4) AS INT)) as maximo 
            FROM OFA_Apelaciones 
            WHERE Activo = 1 
            AND IdSala = @0 
            AND IdCatNomenclatura = @1
            AND RIGHT(FolioApelacion, 4) = @2
        `, [idSala, idNomenclatura, anio]);

        const siguiente = (result[0]?.maximo || 0) + 1;
        return `${siguiente.toString().padStart(4, '0')}/${anio}`;
    }
}