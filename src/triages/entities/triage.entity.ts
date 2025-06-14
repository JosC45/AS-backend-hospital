import { Paciente } from "src/pacientes/entities/paciente.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum Prioridad{
    MUY_ALTA="muy_alta",
    ALTA="alta",
    REGULAR="regular",
    BAJO="bajo",
    MUY_BAJO="muy bajo"
}

@Entity()
export class Triage {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>Paciente)
    @JoinColumn({name:'id_paciente'})
    paciente:Paciente;

    @Column()
    latidos_pm:string;

    @Column()
    presion_arterial:string;

    @Column()
    temperatura:number;

    @Column({type:'enum',enum:Prioridad})
    prioridad:Prioridad;

    @Column()
    motivo:string;

    @Column()
    observaciones:string
}
