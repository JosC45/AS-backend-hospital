import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class darAltaDto{
    @IsNotEmpty()
    @IsString()
    diagnostico_alta: string;

    @IsOptional()
    @IsString()
    diagnostico_secundario?: string;

    @IsNotEmpty()
    @IsString()
    tratamiento_realizado: string;

    @IsOptional()
    @IsString()
    recomendaciones_hogar?: string;

    @IsOptional()
    @IsString()
    pronostico?: string;

    // @IsOptional()
    // @IsDateString()
    // fecha_salida: Date;
}