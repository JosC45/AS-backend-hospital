import { Historia } from "src/historias/entities/historia.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum Prioridad{
    ROJO = 'rojo',
    NARANJA = 'naranja',
    AMARILLO = 'amarillo',
    VERDE = 'verde',
    AZUL = 'azul',
}

@Entity()
export class Triage {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>Historia)
    @JoinColumn({name:'id_historia'})
    historia:Historia;

    @Column()
    motivo:string;

    @Column({default:'-'})
    presion_arterial:string;

    @Column({default:'-'})
    latidos_pm:string;

    @Column({default:'-'})
    frecuencia_respiratoria:string;

    @Column({type:'float',nullable:true})
    temperatura:number;

    @Column({type:'enum',enum:Prioridad})
    prioridad:Prioridad;

    @Column({default:'-'})
    observaciones:string;

    @Column({default:'proceso'})
    estado: 'proceso' | 'finalizado';
    
    @Column()
    fecha_creacion:Date
}
