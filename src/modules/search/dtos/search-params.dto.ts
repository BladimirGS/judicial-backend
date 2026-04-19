import { IsOptional, IsString, IsNumberString, IsDateString } from 'class-validator';

export class SearchParamsDTO {
    @IsOptional()
    @IsString()
    folioOficialia?: string;

    @IsOptional()
    @IsNumberString()
    idSala?: number;

    @IsOptional()
    @IsNumberString()
    idNomenclatura?: number;

    @IsOptional()
    @IsNumberString()
    idTipoApelacion?: number;

    @IsOptional()
    @IsString()
    folioApelacion?: string;

    @IsOptional()
    @IsString()
    expedienteCausa?: string;

    @IsOptional()
    @IsString()
    nombreParte?: string;

    @IsOptional()
    @IsDateString({}, { message: 'Fecha de inicio debe ser una fecha válida' })
    fechaInicio?: string;

    @IsOptional()
    @IsDateString({}, { message: 'Fecha de fin debe ser una fecha válida' })
    fechaFin?: string;

    static hasAtLeastOneParam(params: any): boolean {
        const { 
            folioOficialia, idSala, idNomenclatura, idTipoApelacion, 
            folioApelacion, expedienteCausa, nombreParte, 
            fechaInicio, fechaFin
        } = params;
        
        return !!(folioOficialia || idSala || idNomenclatura || 
                  idTipoApelacion || folioApelacion || expedienteCausa || 
                  nombreParte || fechaInicio || fechaFin);
    }
}