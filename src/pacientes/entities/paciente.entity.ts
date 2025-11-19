// src/pacientes/entities/paciente.entity.ts

import { Historia } from "src/historias/entities/historia.entity";
import { Triage } from "src/triages/entities/triage.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, DeleteDateColumn } from "typeorm";
import { Orden } from "src/ordenes/entities/orden.entity";
import { Hospitalizacion } from "src/hospitalizacion/entities/hospitalizacion.entity";
import { Cita } from "src/citas/entities/cita.entity";

export enum GENERO {
    MASCULINO = "masculino",
    FEMENINO = "femenino"
}

export enum SEGURO {
    SIS = "Sis",
    ESSALUD = "EsSalud",
    EPS = "EPS",
    PARTICULAR = "Particular"
}

@Entity('paciente')
export class Paciente {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombres: string;

    @Column()
    apellidos: string;

    @Column()
    dni: number;

    @Column()
    fecha_nacimiento: Date;

    @Column()
    correo: string;

    @Column()
    numero: string;

    @Column()
    domicilio: string;

    @Column({ type: "enum", enum: GENERO })
    genero: GENERO;

    @Column({ type: "enum", enum: SEGURO })
    seguro: SEGURO;

    @Column()
    tipo_sangre: string;

    @OneToOne(() => Historia, { cascade: true })
    @JoinColumn()
    historia: Historia;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => Hospitalizacion, (hospitalizacion) => hospitalizacion.paciente)
    hospitalizaciones: Hospitalizacion[];

    @OneToMany(() => Orden, (orden) => orden.paciente)
    ordenes: Orden[];

    @OneToMany(() => Cita, (cita) => cita.paciente)
    citas: Cita[];
}