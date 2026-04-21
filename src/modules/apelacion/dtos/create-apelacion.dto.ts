import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsInt, IsArray, Min } from "class-validator";

export class CreateParteDTO {
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @IsString({ message: 'El nombre debe ser texto' })
    nombre!: string;

    @IsOptional()
    @IsString({ message: 'La dirección debe ser texto' })
    direccion?: string;

    @IsBoolean({ message: 'El campo menorEdad debe ser verdadero o falso' })
    menorEdad!: boolean;

    @IsNotEmpty({ message: 'El tipo de parte es requerido' })
    @IsInt({ message: 'El tipo de parte debe ser un número entero' })
    @Min(1, { message: 'El tipo de parte no es válido' })
    idTipoParte!: number;

    @IsNotEmpty({ message: 'El sexo es requerido' })
    @IsInt({ message: 'El sexo debe ser un número entero' })
    @Min(1, { message: 'El sexo no es válido' })
    idSexo!: number;
}

export interface CreateRelacionDTO {
    ofendido: CreateParteDTO;
    procesado: CreateParteDTO;
    delitoRelaciones: Array<{ idDelito: number }>;
}

export class CreateApelacionDTO {
    @IsNotEmpty({ message: 'La materia es requerida' })
    @IsInt({ message: 'La materia debe ser un número entero' })
    idMateria!: number;

    @IsOptional()
    @IsInt({ message: 'La nomenclatura debe ser un número entero' })
    idNomenclatura?: number;

    @IsNotEmpty({ message: 'La apelación es requerida' })
    @IsInt({ message: 'La apelación debe ser un número entero' })
    idApelacion!: number;

    @IsNotEmpty({ message: 'El tipo de apelación es requerido' })
    @IsInt({ message: 'El tipo de apelación debe ser un número entero' })
    idTipoApelacion!: number;

    @IsNotEmpty({ message: 'El tipo de escrito es requerido' })
    @IsInt({ message: 'El tipo de escrito debe ser un número entero' })
    idTipoEscrito!: number;

    @IsNotEmpty({ message: 'El juzgado es requerido' })
    @IsInt({ message: 'El juzgado debe ser un número entero' })
    idJuzgado!: number;

    @IsOptional()
    @IsInt({ message: 'El municipio debe ser un número entero' })
    idMunicipio?: number;

    @IsOptional()
    @IsInt({ message: 'La localidad debe ser un número entero' })
    idLocalidad?: number;

    @IsOptional()
    @IsInt({ message: 'La etnia debe ser un número entero' })
    idEtnia?: number;

    @IsNotEmpty({ message: 'El folio de oficialía es requerido' })
    @IsString({ message: 'El folio de oficialía debe ser texto' })
    folioOficialia!: string;

    @IsOptional()
    @IsString({ message: 'El folio de apelación debe ser texto' })
    folioApelacion?: string;

    @IsOptional()
    @IsString({ message: 'El folio de oficio debe ser texto' })
    folioOficio?: string;

    @IsNotEmpty({ message: 'El expediente/causa es requerido' })
    @IsString({ message: 'El expediente/causa debe ser texto' })
    expedienteCausa!: string;

    @IsOptional()
    @IsInt({ message: 'Las fojas deben ser un número entero' })
    @Min(1, { message: 'Las fojas deben ser mayor a 0' })
    fojas?: number;

    @IsNotEmpty({ message: 'La fecha de auto es requerida' })
    fechaAuto!: Date;

    @IsOptional()
    @IsString({ message: 'El lugar de hechos debe ser texto' })
    lugarHechos?: string;

    @IsOptional()
    @IsString({ message: 'El asunto debe ser texto' })
    asunto?: string;

    @IsOptional()
    @IsString({ message: 'Las observaciones deben ser texto' })
    observaciones?: string;

    @IsOptional()
    @IsBoolean({ message: 'El campo esReposicion debe ser verdadero o falso' })
    esReposicion?: boolean;

    @IsArray({ message: 'Las relaciones deben ser un arreglo' })
    relaciones!: CreateRelacionDTO[];
}