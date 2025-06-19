import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Tipo_Personal } from "../entities/personal.entity";

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

    // @ValidateNested()
    // @Type(() => CreateUsuarioDto)
    // usuario: CreateUsuarioDto;
}
