import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { TIPO_MEDICO } from "../entities/medico.entity";
import { Type } from "class-transformer";
import { CreateUsuarioDto } from "src/usuario/dto/create-usuario.dto";

export class CreateMedicoDto {
    @IsString()
    @IsNotEmpty()
    nombres: string;

    @IsString()
    @IsNotEmpty()
    apellidos: string;

    @IsEmail()
    @IsNotEmpty()
    correo: string;

    @IsString()
    @IsNotEmpty()
    dni: string;

    @IsEnum(TIPO_MEDICO)
    tipo: TIPO_MEDICO;

    @IsOptional()
    @IsString()
    especialidad?: string;

    // @ValidateNested()
    // @Type(() => CreateUsuarioDto)
    // usuario: CreateUsuarioDto;
}
