import { Paciente } from "src/pacientes/entities/paciente.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, DeleteDateColumn } from "typeorm";
import { Camas } from "./camas.entity";
import { Medico } from "src/medicos/entities/medico.entity";
import { Triage } from "src/triages/entities/triage.entity";
import { Consulta } from "src/consultas/entities/consulta.entity";

export enum Estado_Hospitalizacion {
    HOSPITALIZADO = "hospitalizado",
    ALTA = "alta"
}
export enum AREA_DESTINO {
    MEDICINA = "medicina_interna",
    CIRUGIA = "cirugia",
    PEDIATRIA = "pediatria",
    GINECOLOGIA = "ginecologia",
    UCI = "uci"
}
export enum INTERVENCION {
    TRIAJE = "triaje",
    CONSULTA = "consulta"
} 

@Entity('hospitalizacion')
export class Hospitalizacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: INTERVENCION })
    intervencion: INTERVENCION;

    @Column()
    id_intervencion: number;

    @Column()
    fecha_ingreso: Date;

    @Column({ type: 'enum', enum: Estado_Hospitalizacion })
    estado: Estado_Hospitalizacion;

    @Column()
    diagnostico_ingreso: string;

    @Column({ type: 'enum', enum: AREA_DESTINO })
    area_destino: AREA_DESTINO;
    
    @ManyToOne(() => Paciente, (paciente) => paciente.hospitalizaciones)
    @JoinColumn({ name: "id_paciente" })
    paciente: Paciente;

    @ManyToOne(() => Camas, (cama) => cama.hospitalizaciones)
    @JoinColumn({ name: "id_cama" })
    cama: Camas;

    @ManyToOne(() => Medico, (medico) => medico.hospitalizaciones)
    @JoinColumn({ name: "id_medico" })
    medico: Medico;

    @Column({ nullable: true })
    diagnostico_alta: string;

    @Column({ nullable: true })
    diagnostico_secundario: string;

    @Column({ nullable: true })
    tratamiento_realizado: string;

    @Column({ nullable: true })
    recomendaciones_hogar: string;

    @Column({ nullable: true })
    pronostico: string

    @Column({ nullable: true })
    fecha_salida: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}