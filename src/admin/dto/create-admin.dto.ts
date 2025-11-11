import { Type } from 'class-transformer';
import { CreateUsuarioDto } from 'src/usuario/dto/create-usuario.dto';
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAdminDto {
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

    @ValidateNested()
    @Type(() => CreateUsuarioDto)
    usuario: CreateUsuarioDto;
}
