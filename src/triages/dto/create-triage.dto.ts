import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Prioridad } from "../entities/triage.entity";

export class CreateTriageDto {
    @IsNotEmpty()
    @IsNumber()
    id_paciente: number;

    @IsNotEmpty()
    @IsString()
    latidos_pm: string;

    @IsNotEmpty()
    @IsString()
    presion_arterial: string;

    @IsNotEmpty()
    @IsNumber()
    temperatura: number;

    @IsNotEmpty()
    @IsEnum(Prioridad)
    prioridad: Prioridad;

    @IsNotEmpty()
    @IsString()
    motivo: string;

    @IsOptional()
    @IsString()
    observaciones?: string;
}
