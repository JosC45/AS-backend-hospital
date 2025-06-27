import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Pisos{
    PISO1="piso1",
    PISO2="piso2",
    PISO3="piso3"
}

@Entity()
export class Camas{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:"enum",enum:Pisos})
    piso:Pisos;

    @Column()
    cama:number;
}