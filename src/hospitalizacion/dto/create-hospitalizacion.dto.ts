import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsInt, isDateString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { AREA_DESTINO, Estado_Hospitalizacion, INTERVENCION } from '../entities/hospitalizacion.entity';

export class CreateHospitalizacionDto {
    @IsEnum(INTERVENCION)
    intervencion: INTERVENCION;

    @IsInt()
    id_intervencion: number;

    @IsDateString()
    fecha_ingreso: Date;

    @IsEnum(Estado_Hospitalizacion)
    estado: Estado_Hospitalizacion;

    @IsInt()
    id_cama: number;

    @IsString()
    diagnostico_ingreso: string;

    @IsEnum(AREA_DESTINO)
    area_destino: AREA_DESTINO;

    @IsInt()
    id_medico: number;

}