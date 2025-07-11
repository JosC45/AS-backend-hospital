import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { LugarEmision } from '../entities/orden.entity';
import { Type } from 'class-transformer';
import { CreateMedicamentoDto } from './create-medicamento.dto';

export class CreateOrdeneDto {
    @IsNumber()
    @IsNotEmpty()
    id_paciente: number;

    @IsEnum(LugarEmision)
    lugar_emision: LugarEmision;

    @IsString()
    @IsNotEmpty()
    diagnostico_principal: string;

    @IsString()
    @IsNotEmpty()
    indicaciones_terapeuticas: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateMedicamentoDto)
    medicamentos: CreateMedicamentoDto[];
}
