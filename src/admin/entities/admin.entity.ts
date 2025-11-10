import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombres: string;

    @Column()
    apellidos: string;

    @Column()
    correo: string;

    @Column()
    dni: string;

    @Column({ name: 'usuarioId', nullable: true })
    usuarioId: number;

    @OneToOne(() => Usuario, (usuario) => usuario.admin)
    @JoinColumn({ name: 'usuarioId' })
    usuario: Usuario;
}