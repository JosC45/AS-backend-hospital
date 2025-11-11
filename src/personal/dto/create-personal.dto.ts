import { IsEmail, IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Tipo_Personal } from "../entities/personal.entity";
import { Type } from "class-transformer";
import { CreateUsuarioDto } from "src/usuario/dto/create-usuario.dto";

export class CreatePersonalDto {
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

    @IsEnum(Tipo_Personal)
    tipo: Tipo_Personal;

    @ValidateNested()
    @Type(() => CreateUsuarioDto)
    @IsNotEmpty()
    usuario: CreateUsuarioDto;
}
