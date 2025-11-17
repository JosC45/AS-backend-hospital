import { Paciente } from "../../pacientes/entities/paciente.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Medicamento } from "./medicamentos.entity";

export enum LugarEmision{
    EXTERNO="consultorio_externo",
    EMERGENCIA="emergencia",
    HOSPITALIZACION="hospitalizacion",
    UCI="uci"
}

@Entity()
export class Orden {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>Paciente)
    @JoinColumn({name:'id_paciente'})
    paciente:Paciente;

    @Column()
    lugar_emision:LugarEmision;

    @Column()
    diagnostico_principal:string;

    @OneToMany(()=>Medicamento,medicamento=>medicamento.orden,{cascade: true,onDelete: 'CASCADE'})
    medicamento:Medicamento[];

    @Column()
    indicaciones_terapeuticas:string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_creacion:Date
}
