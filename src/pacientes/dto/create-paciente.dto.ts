import { IsDateString, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreatePacienteDto {
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
    
        @IsInt()
        @IsNotEmpty()
        dni:number;
    
        @IsDateString()
        @IsNotEmpty()
        fecha_nacimiento:Date;
    
        @IsString()
        domicilio:string;
    
        @IsString()
        @IsNotEmpty()
        tipo_sangre:string;
}
