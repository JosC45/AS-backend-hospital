import { Medico } from "src/medicos/entities/medico.entity";
import { Paciente } from "src/pacientes/entities/paciente.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, DeleteDateColumn } from "typeorm";

export enum EspecialidadCita {
    CONSULTORIO_EXTERNO = "consultorio_externo",
    PROCEDIMIENTO = "procedimiento",
    OTRO = "otro",
}

export enum EstadoCita {
    PROGRAMADA = "Programada",
    CONFIRMADA = "Confirmada",
    COMPLETADA = "Completada",
    CANCELADA = "Cancelada",
    AUSENTE = "Ausente",
}

@Entity('cita')
export class Cita {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Paciente, paciente => paciente.citas)
    @JoinColumn({ name: 'id_paciente' })
    paciente: Paciente;

    @ManyToOne(() => Medico, medico => medico.citas) 
    @JoinColumn({ name: 'id_medico' })
    medico: Medico;

    @Column({ type: 'enum', enum: EspecialidadCita })
    especialidad: EspecialidadCita;

    @Column()
    fecha_hora_inicio: Date;

    @Column()
    fecha_hora_fin: Date;

    @Column()
    motivo: string;

    @Column({ type: 'enum', enum: EstadoCita, default: EstadoCita.PROGRAMADA })
    estado: EstadoCita;

    @DeleteDateColumn()
    deletedAt: Date;
}