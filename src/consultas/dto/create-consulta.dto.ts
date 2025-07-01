import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { TIPO_DIAGNOSTICO } from "../entities/consulta.entity";

export class CreateConsultaDto {
    @IsNumber()
    @IsNotEmpty()
    id_historia: number; // ID de la historia asociada

    @IsNumber()
    @IsNotEmpty()
    id_medico:number;

    @IsDateString()
    @IsNotEmpty()
    fecha_atencion:Date;

    @IsString()
    @IsNotEmpty()
    motivo_consulta: string;

    @IsString()
    @IsOptional()
    tiempo_enfermedad?: string;

    @IsString()
    @IsOptional()
    presion_arterial?: string;

    @IsString()
    @IsOptional()
    latidos_pm?: string;

    @IsString()
    @IsOptional()
    frecuencia_respiratoria?: string;

    @IsNumber()
    @IsOptional()
    temperatura?: number;

    @IsString()
    @IsOptional()
    peso?: string;

    @IsString()
    @IsOptional()
    talla?: string;

    @IsString()
    @IsOptional()
    observaciones?: string;

    @IsString()
    @IsOptional()
    descripcion_diagnostico?: string;

    @IsString()
    @IsOptional()
    codigo?: string;

    @IsEnum(TIPO_DIAGNOSTICO)
    @IsOptional()
    tipo_diagnostico?: TIPO_DIAGNOSTICO;

    @IsString()
    @IsOptional()
    tratamiento?: string;
}
