import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum ROLES{
    ADMIN="admin",
    MEDICO="medico",
    SECRETARIA="secretaria"
}

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombres:string;

    @Column()
    apellidos:string;

    @Column()
    correo:string;

    @Column()
    dni:number;

    @Column()
    rol:ROLES;
}
