import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TIPO_CONSULTA } from '../entities/historia.entity';

export class CreateHistoriaDto {
    @IsNumber()
    @IsNotEmpty()
    id_paciente: number;

    @IsEnum(TIPO_CONSULTA)
    tipo_consulta: TIPO_CONSULTA;

    @IsString()
    @IsNotEmpty()
    motivo_consulta: string;

    @IsString()
    @IsNotEmpty()
    resultado_y_diagnostico: string;

    @IsString()
    @IsOptional()
    comentarios_adicionales?: string;
}

