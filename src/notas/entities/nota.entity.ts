import { Hospitalizacion } from "src/hospitalizacion/entities/hospitalizacion.entity";
import { Medico } from "src/medicos/entities/medico.entity";
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
