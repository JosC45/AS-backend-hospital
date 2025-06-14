import { IsNotEmpty, IsString } from "class-validator";

export class BodyAuthDto {
    @IsString()
    @IsNotEmpty()
    username:string;

    @IsString()
    @IsNotEmpty()
    password:string;
}
