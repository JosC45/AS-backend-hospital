import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cita, EstadoCita } from './entities/cita.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepo: Repository<Cita>,
  ) { }

  async create(createCitaDto: CreateCitaDto): Promise<Cita> {
    const { id_paciente, id_medico, fecha_hora_inicio, fecha_hora_fin } = createCitaDto;

    const inicio = new Date(fecha_hora_inicio);
    const fin = new Date(fecha_hora_fin);

    const conflictingAppointments = await this.citaRepo.find({
      relations: ['medico', 'paciente'],
      where: [
        {
          medico: { id: id_medico },
          fecha_hora_inicio: LessThan(fin),
          fecha_hora_fin: MoreThan(inicio),
          estado: EstadoCita.PROGRAMADA,
        },
        {
          paciente: { id: id_paciente },
          fecha_hora_inicio: LessThan(fin),
          fecha_hora_fin: MoreThan(inicio),
          estado: EstadoCita.PROGRAMADA,
        },
      ],
    });

    if (conflictingAppointments.length > 0) {
      const esConflictoMedico = conflictingAppointments.some(c => c.medico.id === id_medico);
      if (esConflictoMedico) {
        throw new ConflictException(`El médico ya tiene una cita programada en ese horario.`);
      }
      throw new ConflictException(`El paciente ya tiene otra cita programada en ese horario.`);
    }

    const nuevaCita = this.citaRepo.create({
      ...createCitaDto,
      paciente: { id: id_paciente },
      medico: { id: id_medico },
    });

    const savedCita = await this.citaRepo.save(nuevaCita);
    return this.findOne(savedCita.id);
  }

  async findAll(): Promise<Cita[]> {
    return this.citaRepo.find({
      relations: ['paciente', 'medico'],
      order: {
        fecha_hora_inicio: 'DESC',
      },
    });
  }

  async findCitasDeHoy(): Promise<Cita[]> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const finDelDia = new Date();
    finDelDia.setHours(23, 59, 59, 999);

    return this.citaRepo.createQueryBuilder('cita')
      .leftJoinAndSelect('cita.paciente', 'paciente')
      .leftJoinAndSelect('cita.medico', 'medico')
      .where('cita.fecha_hora_inicio BETWEEN :hoy AND :finDelDia', { hoy, finDelDia })
      .getMany();
  }

  async findOne(id: number): Promise<Cita> {
    const cita = await this.citaRepo.findOne({
      where: { id },
      relations: ['paciente', 'medico'],
    });
    if (!cita) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }
    return cita;
  }

  async update(id: number, updateCitaDto: UpdateCitaDto): Promise<Cita> {
    const cita = await this.findOne(id);
    this.citaRepo.merge(cita, updateCitaDto);
    return this.citaRepo.save(cita);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.citaRepo.softDelete(id); // Usamos softDelete
    if (result.affected === 0) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }
    return { message: `Cita con ID ${id} eliminada correctamente` };
  }
}