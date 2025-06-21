import { Usuario } from "src/usuario/entities/usuario.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
export enum Tipo_Personal{
    SECRETARIA="secretaria",
    CAJERA="cajera"
}

@Entity()
export class Personal {
    @PrimaryGeneratedColumn()
    id:number;
    
    @Column()
    nombres:string;
    
    @Column()
    apellidos:string;

    @Column()
    correo:string;

    @Column()
    dni:string;

    @Column({type:'enum',enum:Tipo_Personal})
    tipo:Tipo_Personal;

    @OneToOne(()=>Usuario,{cascade:true})
    @JoinColumn()
    usuario:Usuario;
}
