import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Orden } from "./orden.entity";

@Entity()
export class Medicamento{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombre:string;

    @Column()
    presentacion:string;

    @Column()
    dosis: string;

    @Column()
    via_administracion:string;

    @Column()
    frecuencia:string;

    @Column()
    duracion:string;

    @ManyToOne(()=>Orden,orden=>orden.medicamento,{onDelete: 'CASCADE'})
    @JoinColumn({name:'id_orden'})
    orden:Orden;
}
