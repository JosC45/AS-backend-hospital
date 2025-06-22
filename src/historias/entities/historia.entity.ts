import { Medico } from "src/medicos/entities/medico.entity";
import { Paciente } from "src/pacientes/entities/paciente.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum TIPO_CONSULTA{
    NUEVA="nueva",
    SEGUIMIENTO="seguimiento",
    POST_OPERATORIO="post-operatorio"
}

@Entity()
export class Historia {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>Paciente)
    @JoinColumn({name:'id_paciente'})
    paciente:Paciente;

    @ManyToOne(()=>Medico)
    @JoinColumn({name:"id_medico"})
    medico:Medico;

    @Column({type:'enum',enum:TIPO_CONSULTA})
    tipo_consulta:TIPO_CONSULTA;

    @Column()
    motivo_consulta:string;

    @Column()
    resultado_y_diagnostico:string;

    @Column()
    comentarios_adicionales:string;

    @Column()
    fecha_creacion:Date;
}
