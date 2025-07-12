import { PartialType } from '@nestjs/mapped-types';
import { CreateHistoriaDto } from './create-historia.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateHistoriaDto  {
    @IsString()
    @IsOptional()
    antecedentes_natales?:string;

    @IsString()
    @IsOptional()
    antecedentes_personales?:string;

    @IsString()
    @IsOptional()
    antecedentes_familiares?:string;


}
