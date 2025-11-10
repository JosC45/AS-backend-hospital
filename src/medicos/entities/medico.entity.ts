import { Usuario } from "src/usuario/entities/usuario.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum TIPO_MEDICO{
    ASISTENTE="asistente",
    INTERNO="interno",
    ESPECIALISTA="especialista"
}

@Entity()
export class Medico {
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

    @Column({type:'enum',enum:TIPO_MEDICO})
    tipo:TIPO_MEDICO;

    @Column({nullable:true})
    especialidad:string;

    @Column({ name: 'usuarioId', nullable: true })
    usuarioId: number;

    @OneToOne(() => Usuario, (usuario) => usuario.medico)
    @JoinColumn({ name: 'usuarioId' })
    usuario: Usuario;
}
