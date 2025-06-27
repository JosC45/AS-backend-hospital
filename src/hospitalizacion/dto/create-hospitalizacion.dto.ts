import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsInt, isDateString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { Estado_Hospitalizacion } from '../entities/hospitalizacion.entity';

export class CreateHospitalizacionDto {
    @IsInt()
    @IsNotEmpty()
    id_paciente: number;

    @IsDateString()
    @IsNotEmpty()
    fecha_ingreso: Date;

    @IsDateString()
    @IsOptional()
    fecha_salida?: Date;

    @IsEnum(Estado_Hospitalizacion)
    @IsNotEmpty()
    estado: Estado_Hospitalizacion;

    @IsInt()
    @IsNotEmpty()
    id_cama: number;

    @IsString()
    @IsNotEmpty()
    diagnostico_ingreso: string;

    @IsString()
    @IsNotEmpty()
    recomendaciones_medicas: string;

    @IsString()
    @IsNotEmpty()
    plan_seguimiento: string;
}