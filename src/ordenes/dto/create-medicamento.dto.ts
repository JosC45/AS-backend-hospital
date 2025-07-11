import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMedicamentoDto{
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    presentacion: string;

    @IsNumber()
    @IsNotEmpty()
    dosis: number;

    @IsString()
    @IsNotEmpty()
    via_administracion: string;

    @IsString()
    @IsNotEmpty()
    frecuencia: string;

    @IsString()
    @IsNotEmpty()
    duracion: string;

    @IsNumber()
    @IsNotEmpty()
    id_orden: number;
}