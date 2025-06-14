import { Triage } from "src/triages/entities/triage.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Paciente {
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
    fecha_nacimiento:Date;

    @Column()
    domicilio:string;

    @Column()
    tipo_sangre:string;

    @OneToMany(()=>Triage,triage=>triage.paciente)
    triages:Triage[]
}
