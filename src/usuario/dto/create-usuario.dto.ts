import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ROLES } from "../entities/usuario.entity";

export class CreateUsuarioDto {
    @IsInt()
    @IsNotEmpty()
    id:number;
    
    @IsString()
    @IsNotEmpty()
    nombres:string;

    @IsString()
    @IsNotEmpty()
    apellidos:string;

    @IsString()
    @IsNotEmpty()
    correo:string;

    @IsString()
    @IsNotEmpty()
    contraseña:string;

    @IsInt()
    @IsNotEmpty()
    dni:number;

    @IsEnum(ROLES)
    rol:ROLES;
}
