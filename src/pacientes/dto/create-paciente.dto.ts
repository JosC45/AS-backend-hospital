import { IsDateString, IsEmail, IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, IsOptional, IsDate } from "class-validator";
import { GENERO, SEGURO } from "../entities/paciente.entity";

export class CreatePacienteDto {
        @IsString()
        @IsNotEmpty()
        nombres: string;

        @IsString()
        @IsNotEmpty()
        apellidos: string;

        @IsNumber()
        @IsNotEmpty()
        dni: number;

        @IsDateString()
        @IsNotEmpty()
        fecha_nacimiento: Date;

        @IsEmail()
        @IsNotEmpty()
        correo: string;

        @IsString()
        @IsNotEmpty()
        numero: string;

        @IsString()
        domicilio: string;

        @IsEnum(GENERO)
        @IsNotEmpty()
        genero: GENERO;

        @IsEnum(SEGURO)
        @IsNotEmpty()
        seguro: SEGURO;
        
        @IsString()
        @IsNotEmpty()
        tipo_sangre: string;

        @IsOptional()
        @IsDate()
        deletedAt?: Date;
}
