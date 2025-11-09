import { Historia } from "src/historias/entities/historia.entity";
import { Triage } from "src/triages/entities/triage.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, DeleteDateColumn } from "typeorm";

export enum GENERO{
    MASCULINO="masculino",
    FEMENINO="femenino"
}

export enum SEGURO{
    SIS="Sis",
    ESSALUD="EsSalud",
    EPS="EPS",
    PARTICULAR="Particular"
}
@Entity()
export class Paciente {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombres:string;
    
    @Column()
    apellidos:string;

    @Column()
    dni:number;
    
    @Column()
    fecha_nacimiento:Date;
    
    @Column()
    correo:string;

    @Column()
    numero:string;

    @Column()
    domicilio:string;

    @Column({type:"enum",enum:GENERO})
    genero:GENERO;

    @Column({type:"enum",enum:SEGURO})
    seguro:SEGURO;

    @Column()
    tipo_sangre:string;

    @OneToOne(()=>Historia,{cascade:true})
    @JoinColumn()
    historia:Historia;

    @DeleteDateColumn()
    deletedAt: Date;
}
