import { Consulta } from "src/consultas/entities/consulta.entity";
import { Medico } from "src/medicos/entities/medico.entity";
import { Paciente } from "src/pacientes/entities/paciente.entity";
import { Triage } from "src/triages/entities/triage.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum TIPO_CONSULTA{
    NUEVA="nueva",
    SEGUIMIENTO="seguimiento",
    POST_OPERATORIO="post-operatorio"
}

@Entity()
export class Historia {
    @PrimaryGeneratedColumn()
    id:number;
    
    @OneToOne(()=>Paciente,paciente=>paciente.historia)
    // @JoinColumn()
    paciente:Paciente;

    @OneToMany(()=>Triage,triage=>triage.historia)
    triage:Triage[];

    @OneToMany(()=>Consulta,consulta=>consulta.historia)
    consulta:Consulta[];

    @Column()
    fecha_creacion:Date;

    @Column({nullable:true})
    antecedentes_natales:string;

    @Column({nullable:true})
    antecedentes_personales:string;

    @Column({nullable:true})
    antecedentes_familiares:string;


}
