import { Paciente } from "src/pacientes/entities/paciente.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Camas } from "./camas.entity";

export enum Estado_Hospitalizacion{
    ACTIVA="activa",
    ALTA="alta"
}

@Entity()
export class Hospitalizacion {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>Paciente)
    @JoinColumn({name:"id_paciente"})
    paciente:Paciente;

    @Column()
    fecha_ingreso:Date;

    @Column({nullable:true})
    fecha_salida:Date;

    @Column({type:'enum',enum:Estado_Hospitalizacion})
    estado:Estado_Hospitalizacion;

    @ManyToOne(()=>Camas)
    @JoinColumn({name:"id_cama"})
    cama:Camas;

    @Column()
    diagnostico_ingreso:string;

    @Column()
    recomendaciones_medicas:string;

    @Column()
    plan_seguimiento:string;
}
