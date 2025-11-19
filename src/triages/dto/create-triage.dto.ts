import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Prioridad } from "../entities/triage.entity";

export class CreateTriageDto {
    @IsNumber()
    @IsNotEmpty()
    id_historia: number;

    @IsNumber()
    @IsNotEmpty()
    id_medico: number;

    @IsString()
    @IsNotEmpty()
    motivo: string;

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

    @IsEnum(Prioridad)
    @IsNotEmpty()
    prioridad: Prioridad;

    @IsString()
    @IsOptional()
    observaciones?: string;
}
