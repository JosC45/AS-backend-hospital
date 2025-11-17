import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Camas } from "./camas.entity";
import { Medico } from "../../medicos/entities/medico.entity";


export enum Estado_Hospitalizacion{
    HOSPITALIZADO="hospitalizado",
    ALTA="alta"
}

export enum AREA_DESTINO{
    MEDICINA="medicina_interna",
    CIRUGIA="cirugia",
    PEDIATRIA="pediatria",
    GINECOLOGIA="ginecologia",
    UCI="uci"
}
export enum INTERVENCION{
    TRIAJE="triaje",
    CONSULTA="consulta"
}

@Entity()
export class Hospitalizacion {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:'enum',enum:INTERVENCION})
    intervencion:INTERVENCION;

    @Column()
    id_intervencion:number;

    // @ManyToOne(()=>Triage)
    // @JoinColumn({name:"id_triaje"})
    // triage:Triage;

    // @ManyToOne(()=>Consulta)
    // @JoinColumn({name:"id_consulta"})
    
    @Column()
    fecha_ingreso:Date;

    @Column({type:'enum',enum:Estado_Hospitalizacion})
    estado:Estado_Hospitalizacion;
    
    @ManyToOne(()=>Camas)
    @JoinColumn({name:"id_cama"})
    cama:Camas;
    
    @Column()
    diagnostico_ingreso:string;
    
    @Column({type:'enum',enum:AREA_DESTINO})
    area_destino:AREA_DESTINO;
    
    @ManyToOne(()=>Medico)
    @JoinColumn({name:"id_medico"})
    medico:Medico;
    
    /////////////////////////////
    
    @Column({nullable:true})
    diagnostico_alta:string;
    
    @Column({nullable:true})
    diagnostico_secundario:string;
    
    @Column({nullable:true})
    tratamiento_realizado:string;
    
    @Column({nullable:true})
    recomendaciones_hogar:string;
    
    @Column({nullable:true})
    pronostico:string
    
    @Column({nullable:true})
    fecha_salida:Date;
}
