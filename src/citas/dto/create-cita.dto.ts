import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EspecialidadCita, EstadoCita } from '../entities/cita.entity';

export class CreateCitaDto {
    @IsNumber()
    id_paciente: number;

    @IsNumber()
    id_medico: number;

    @IsEnum(EspecialidadCita)
    especialidad: EspecialidadCita;

    @IsDateString()
    fecha_hora_inicio: string;

    @IsDateString()
    fecha_hora_fin: string;

    @IsString()
    motivo: string;

    @IsOptional()
    @IsEnum(EstadoCita)
    estado?: EstadoCita;
}