import { Medico } from "src/medicos/entities/medico.entity";
import { Paciente } from "src/pacientes/entities/paciente.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum Especialidad{
    EMERGENCIA="emergencia",
    CONSULTORIO_EXTERNO="consultorio_externo",
    HOSPITALIZACION="hospitalizacion"
}

@Entity()
export class Cita {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>Paciente)
    @JoinColumn({name:'id_paciente'})
    paciente:Paciente;

    @ManyToOne(()=>Medico)
    @JoinColumn({name:'id_medico'})
    medico:Medico;

    @Column({type:'enum',enum:Especialidad})
    especialidad:Especialidad;

    @Column()
    fecha_atencion:Date;

    @Column()
    motivo:string
}
