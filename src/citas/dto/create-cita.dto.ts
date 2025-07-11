import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Especialidad } from "../entities/cita.entity";

export class CreateCitaDto {
    @IsNumber()
    @IsNotEmpty()
    id_paciente: number;

    @IsNumber()
    @IsNotEmpty()
    id_medico: number;

    @IsEnum(Especialidad)
    especialidad: Especialidad;

    @IsDateString()
    fecha_atencion: string; 

    @IsString()
    @IsNotEmpty()
    motivo: string;
}
