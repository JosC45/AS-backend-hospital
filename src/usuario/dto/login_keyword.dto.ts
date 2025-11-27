import { IsNotEmpty, IsString } from "class-validator";
import { Usuario } from "../entities/usuario.entity";


export class LoginKeywordDto{
    @IsString()
    @IsNotEmpty()
    username:string;

    @IsString()
    @IsNotEmpty()
    keyword:string;
}