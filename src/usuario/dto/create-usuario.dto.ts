import { IsEnum,  IsNotEmpty, IsString } from "class-validator";
import {  ROLES_USUARIO } from "../entities/usuario.entity";

export class CreateUsuarioDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEnum(ROLES_USUARIO)
    rol: ROLES_USUARIO;

    // @IsEnum(ESTADO_USUARIO)
    // estado: ESTADO_USUARIO;
}
