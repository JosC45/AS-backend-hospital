import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Usuario } from "src/usuario/entities/usuario.entity";

export class CreateKeywordDto {
    @IsString()
    @IsNotEmpty()
    keyword:string;

    
    @IsNotEmpty()
    usuario: Usuario;
}
