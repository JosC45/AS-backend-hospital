import { Cita } from "src/citas/entities/cita.entity";
import { Historia } from "src/historias/entities/historia.entity";
import { Medico } from "src/medicos/entities/medico.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum TIPO_DIAGNOSTICO{
    PRESUNTIVO="presuntivo",
    DEFINITIVO="definitivo",
    REPETITIVO="repetitivo"
}

export enum ESTADO_CONSULTA {
    FINALIZADO = 'finalizado',
    HOSPITALIZACION_ORDENADA = 'hospitalizacion_ordenada'
}

@Entity()
export class Consulta {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    motivo_consulta:string;
    
    @ManyToOne(()=>Medico)
    @JoinColumn({name:"id_medico"})
    medico:Medico;

    @Column()
    fecha_atencion:Date;
    
    @Column({default:'-'})
    tiempo_enfermedad:string;

    @Column({default:'-'})
    presion_arterial:string;

    @Column({default:'-'})
    latidos_pm:string;

    @Column({default:'-'})
    frecuencia_respiratoria:string;

    @Column({type:'float',nullable:true})
    temperatura:number;

    @Column({default:'-'})
    peso:string;

    @Column({default:'-'})
    talla:string;

    @Column({default:'-'})
    observaciones:string;

    @Column({default:'-'})
    descripcion_diagnostico:string;

    @Column({default:'-'})
    codigo:string;

    @Column({type:"enum",enum:TIPO_DIAGNOSTICO,nullable:true})
    tipo_diagnostico:TIPO_DIAGNOSTICO;

    @Column({default:'-'})
    tratamiento:string;

    @Column()
    fecha_creacion:Date;
    
    @Column({
        type: 'enum',
        enum: ESTADO_CONSULTA,
        default: ESTADO_CONSULTA.FINALIZADO
    })
    estado: ESTADO_CONSULTA;

    @ManyToOne(()=>Historia)
    @JoinColumn({name:'id_historia'})
    historia:Historia

    @OneToOne(() => Cita)
    @JoinColumn({ name: 'id_cita' })
    cita: Cita;

}
