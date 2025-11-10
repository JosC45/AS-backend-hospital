import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMedicamentoDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    presentacion: string;

    @IsString()
    @IsNotEmpty()
    dosis: string;

    @IsString()
    @IsNotEmpty()
    via_administracion: string;

    @IsString()
    @IsNotEmpty()
    frecuencia: string;

    @IsString()
    @IsNotEmpty()
    duracion: string;
}