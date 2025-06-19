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

    // @ValidateNested()
    // @Type(() => CreateUsuarioDto)
    // usuario: CreateUsuarioDto;
}
