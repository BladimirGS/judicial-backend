import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class SearchParamsDTO {
    @IsOptional()
    @IsString()
    folioOficialia?: string;

    @IsOptional()
    @IsNumberString()
    idSala?: number;

    // --- ESTAS FALTABAN ---
    @IsOptional()
    @IsNumberString()
    idNomenclatura?: number;

    @IsOptional()
    @IsNumberString()
    idTipoApelacion?: number;

    @IsOptional()
    @IsString()
    folioApelacion?: string;
    // -----------------------

    @IsOptional()
    @IsString()
    expedienteCausa?: string;

    @IsOptional()
    @IsString()
    nombreParte?: string;

    static hasAtLeastOneParam(params: any): boolean {
        // Agregamos todas las propiedades a la validación de "al menos uno"
        const { 
            folioOficialia, idSala, idNomenclatura, 
            idTipoApelacion, folioApelacion, expedienteCausa, nombreParte 
        } = params;
        
        return !!(folioOficialia || idSala || idNomenclatura || 
                  idTipoApelacion || folioApelacion || expedienteCausa || nombreParte);
    }
}