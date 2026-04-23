import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { CatSala } from "./catalogo-sala.entity";
import { CatMateria } from "./catalogo-materia.entity";
import { CatNomenclatura } from "./catalogo-nomenclatura.entity";
import { CatApelacion } from "./catalogo-apelacion.entity";
import { TipoApelacion } from "./tipo-apelacion.entity";
import { TipoEscrito } from "./tipo-escrito.entity";
import { CatJuzgado } from "./catalogo-juzgado.entity";
import { CatMunicipio } from "./catalogo-municipio.entity";
import { CatLocalidad } from "./catalogo-localidad.entity";
import { CatEtnia } from "./catalogo-etnia.entity";
import { ApelacionParte } from "./apelacion-parte.entity";
import { Relacion } from "./relacion.entity";
import { ApelacionAnexo } from "./apelacion-anexo.entity";
import { CatMagistrado } from "./catalogo-magistrado.entity";

@Entity({ name: 'OFA_Apelaciones' })
export class Apelacion {

    @PrimaryGeneratedColumn({ name: 'IdApelacion' })
    id!: number;

    @Column({ name: 'FolioOficialia', length: 9, nullable: true })
    folioOficialia!: string;

    @Column({ name: 'FolioApelacion', length: 25, nullable: true })
    folioApelacion!: string;

    @Column({ name: 'FolioApelacionAnterior', length: 25, nullable: true })
    folioApelacionAnterior!: string;

    @Column({ name: 'FechaAuto', type: 'datetime', nullable: true })
    fechaAuto!: Date;

    @Column({ name: 'ExpedienteCausa', length: 10, nullable: true })
    expedienteCausa!: string;

    @Column({ name: 'FolioOficio', length: 35, nullable: true })
    folioOficio!: string;

    @Column({ name: 'Fojas', type: 'int', nullable: true })
    fojas!: number;

    @Column({ name: 'ExpedienteAcumulado', length: 10, nullable: true })
    expedienteAcumulado!: string;

    @Column({ name: 'Observaciones', length: 2500, nullable: true })
    observaciones!: string;

    @Column({ name: 'FechaHoraRecepcion', type: 'datetime', nullable: true })
    fechaHoraRecepcion!: Date;

    @Column({ name: 'FechaHoraRecepcionAnterior', type: 'datetime', nullable: true })
    fechaHoraRecepcionAnterior!: Date;

    @Column({ name: 'FechaHoraIngresoJuz', type: 'datetime' })
    fechaHoraIngresoJuz!: Date;

    @Column({ name: 'Certificacion', type: 'int', nullable: true })
    certificacion!: number;

    @Column({ name: 'EsReposicion', type: 'bit', default: false })
    esReposicion!: boolean;

    @Column({ name: 'Activo', type: 'bit', default: true })
    activo: boolean = true;

    @Column({ name: 'LugarHechos', length: 200, nullable: true })
    lugarHechos!: string;

    @Column({ name: 'Asunto', length: 300, nullable: true })
    asunto!: string;

    // Relaciones ManyToOne
    @ManyToOne(() => CatSala)
    @JoinColumn({ name: 'IdSala' })
    sala!: CatSala;

    @ManyToOne(() => CatSala)
    @JoinColumn({ name: 'IdSala' })
    salaAnterior!: CatSala;

    @ManyToOne(() => CatMateria)
    @JoinColumn({ name: 'IdCatMateria' })
    materia!: CatMateria;

    @ManyToOne(() => CatNomenclatura)
    @JoinColumn({ name: 'IdCatNomenclatura' })
    nomenclatura!: CatNomenclatura;

    @ManyToOne(() => CatApelacion)
    @JoinColumn({ name: 'IdCatApelacion' })
    catApelacion!: CatApelacion;

    @ManyToOne(() => TipoApelacion)
    @JoinColumn({ name: 'IdCatTipoApelacion' })
    tipoApelacion!: TipoApelacion;

    @ManyToOne(() => TipoEscrito)
    @JoinColumn({ name: 'IdCatTipoEscrito' })
    tipoEscrito!: TipoEscrito;

    @ManyToOne(() => CatJuzgado)
    @JoinColumn({ name: 'IdCatJuzgadoOrigen' })
    catJuzgado!: CatJuzgado;

    @ManyToOne(() => CatMagistrado)
    @JoinColumn({ name: 'IdMagistradoAsignado' })
    catMagistrado!: CatMagistrado;

    @ManyToOne(() => CatMunicipio)
    @JoinColumn({ name: 'IdCatMunicipio' })
    municipio!: CatMunicipio;

    @ManyToOne(() => CatLocalidad)
    @JoinColumn({ name: 'IdCatLocalidad' })
    localidad!: CatLocalidad;

    @ManyToOne(() => CatEtnia)
    @JoinColumn({ name: 'IdEtnia' })
    etnia!: CatEtnia;

    // Relaciones OneToMany
    @OneToMany(() => ApelacionParte, (parte) => parte.apelacion)
    apelacionPartes!: ApelacionParte[];

    @OneToMany(() => Relacion, (rel) => rel.apelacion)
    relaciones!: Relacion[];

    @OneToMany(() => ApelacionAnexo, (anexo) => anexo.apelacion) 
    anexos!: ApelacionAnexo[];

    // Foreign Keys
    @Column({ name: 'IdSala', nullable:true }) idSala!: number;
    @Column({ name: 'IdSalaAnterior', nullable:true }) idSalaAnterior!: number;
    @Column({ name: 'IdCatMateria', nullable:true }) idMateria!: number;
    @Column({ name: 'IdCatNomenclatura', nullable: true }) idNomenclatura!: number;
    @Column({ name: 'IdCatApelacion', nullable:true }) idApelacion!: number;
    @Column({ name: 'IdCatTipoApelacion', nullable:true }) idTipoApelacion!: number;
    @Column({ name: 'IdCatTipoEscrito', nullable: true }) idTipoEscrito!: number;
    @Column({ name: 'IdCatJuzgadoOrigen' }) idJuzgado!: number;
    @Column({ name: 'IdMagistradoAsignado', nullable:true }) idMagistradoAsignado!: number;
    @Column({ name: 'IdCatMunicipio', nullable: true }) idMunicipio!: number;
    @Column({ name: 'IdCatLocalidad', nullable:true }) idLocalidad!: number;
    @Column({ name: 'IdEtnia', nullable:true }) idEtnia!: number;
}