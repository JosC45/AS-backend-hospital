import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Hospitalizacion } from "./hospitalizacion.entity";

// export enum Pisos{
//     PISO1="piso1",
//     PISO2="piso2",
//     PISO3="piso3"
// }
export enum ESTADO_CAMA{
    DISPONIBLE="disponible",
    OCUPADA="ocupada",
    MANTENIMIENTO="mantenimiento"
}

@Entity('camas')
export class Camas{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    piso:string;

    @Column()
    cama:string;

    @Column({type:'enum',enum:ESTADO_CAMA})
    estado:ESTADO_CAMA

    @OneToMany(()=>Hospitalizacion,hospitalizacion=>hospitalizacion.cama)
    hospitalizaciones:Hospitalizacion[]
}