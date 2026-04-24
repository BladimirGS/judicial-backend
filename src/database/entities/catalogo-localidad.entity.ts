import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { CatMunicipio } from "./catalogo-municipio.entity";

@Entity({ name: 'OFA_CAT_Localidades' })
export class CatLocalidad {

    @PrimaryGeneratedColumn({ name: 'IdCatColLocalidad' })
    id!: number;

    @Column({ 
        name: 'Descripcion', 
        type: 'varchar', 
        length: 300, 
        nullable: true 
    })
    descripcion!: string;

    @Column({ 
        name: 'Activo', 
        type: 'bit', 
        default: true 
    })
    activo!: boolean;

    @ManyToOne(() => CatMunicipio)
    @JoinColumn({ name: 'IdCatMunicipio' })
    municipio!: CatMunicipio;

    @Column({ name: 'IdCatMunicipio', nullable: true }) idMunicipio!: number;
}