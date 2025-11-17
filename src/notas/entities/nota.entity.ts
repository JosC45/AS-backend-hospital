import { Hospitalizacion } from "../../hospitalizacion/entities/hospitalizacion.entity";
import { Medico } from "../../medicos/entities/medico.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Nota {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    descripcion:string;

    @Column()
    fecha_creacion:Date;

    @ManyToOne(()=>Hospitalizacion)
    @JoinColumn({name:'id_hospitalizacion'})
    hospitalizacion:Hospitalizacion;

    @ManyToOne(()=>Medico)
    @JoinColumn({name:"id_medico"})
    medico:Medico;
}
