import { Usuario } from "src/usuario/entities/usuario.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Keyword {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    palabra_clave:string;

    @OneToOne(()=>Usuario,usuario=>usuario.keyword)
    @JoinColumn()
    usuario:Usuario;
}
