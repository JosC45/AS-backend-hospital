import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateNotaDto {
    @IsNumber()
    @IsNotEmpty()
    id_hospitalizacion: number;

    @IsNumber()
    @IsNotEmpty()
    id_medico: number;
    
    @IsString()
    @IsNotEmpty()
    descripcion: string;
}
