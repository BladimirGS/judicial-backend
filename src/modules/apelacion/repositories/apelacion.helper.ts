import { EntityManager, In } from "typeorm";
import { CatMateria } from "../../../database/entities/catalogo-materia.entity";

export class ApelacionManualHelper {
    
    static async getMateriasManual(manager: EntityManager) {
        return await manager.find(CatMateria, {
            select: ["id", "descripcion"],
            where: {
                activo: true,
                id: In([5, 6])
            },
            order: { descripcion: "ASC" }
        });
    }

    /**
     * Simula PA_INS_PCF_FolioTramite
     * Formato: 0001/2026 (Global por año)
     */
    static async calcularFolioTramite(manager: EntityManager): Promise<string> {
        const anio = new Date().getFullYear().toString();
        
        // Buscamos el máximo basado en los primeros 4 dígitos del FolioOficialia
        // que coincidan con el año al final (después de la diagonal)
        const result = await manager.query(`
            SELECT MAX(CAST(LEFT(FolioOficialia, 4) AS INT)) as maximo 
            FROM OFA_Apelaciones 
            WHERE Activo = 1 AND RIGHT(FolioOficialia, 4) = @0
        `, [anio]);

        const siguiente = (result[0]?.maximo || 0) + 1;
        return `${siguiente.toString().padStart(4, '0')}/${anio}`;
    }

    /**
     * Simula PA_SEL_FolioNomenclaturaToca
     * Formato: 0001/2026 (Filtrado por Sala y Nomenclatura)
     */
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