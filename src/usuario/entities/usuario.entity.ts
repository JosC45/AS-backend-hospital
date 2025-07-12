    import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

    export enum ESTADO_USUARIO{
        ACTIVO="activo",
        DESACTIVADO="desactivado"
    }
    export enum ROLES_USUARIO{
        PERSONAL="personal",
        MEDICO="medico",
        ADMIN="admin"
    }

    @Entity()
    export class Usuario {
        @PrimaryGeneratedColumn()
        id:number;

        @Column()
        username:string;

        @Column()
        password:string;

        @Column()
        rol:ROLES_USUARIO;

        @Column()
        estado:ESTADO_USUARIO;
    }
