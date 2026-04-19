import { AppDataSource } from "../../../config/data-source";
import { ApelacionAnexo } from "../../../database/entities/apelacion-anexo.entity";
import { CatAnexo } from "../../../database/entities/catalogo-anexo.entity";
import { AddAnexosDTO } from "../dtos/add-anexos.dto";
import { AnexoCatalogosDTO } from "../dtos/anexo-catalogos.dto";

export const AnexoRepository = AppDataSource.getRepository(CatAnexo).extend({
    
    async getCatalogos(): Promise<AnexoCatalogosDTO> {
        const anexos = await this.find({
            select: { id: true, descripcion: true },
            where: { activo: true }
        });

        return { anexos };
    },

    async saveMultipleAnexos(data: AddAnexosDTO) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Creamos las instancias con el manager de la transacción
            const entities = data.anexos.map(anexo => 
                queryRunner.manager.create(ApelacionAnexo, {
                    ...anexo,
                    idApelacion: data.idApelacion
                })
            );

            // Bulk Save: TypeORM enviará un solo INSERT optimizado si es posible
            const savedAnexos = await queryRunner.manager.save(entities);

            await queryRunner.commitTransaction();
            return savedAnexos;

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
});