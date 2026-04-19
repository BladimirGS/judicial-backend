import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'OFA_CAT_Magistrados' })
export class CatMagistrado {

    @PrimaryGeneratedColumn({ name: 'IdMagistrado' })
    id!: number;

    @Column({ 
        name: 'NombreCompleto', 
        type: 'varchar', 
        length: 255, 
    })
    descripcion!: string;

    @Column({ 
        name: 'Activo', 
        type: 'bit', 
    })
    activo!: boolean;
}