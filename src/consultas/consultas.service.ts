import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Consulta, ESTADO_CONSULTA } from './entities/consulta.entity';
import { Cita, EstadoCita } from 'src/citas/entities/cita.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class ConsultasService {
  constructor(
    @InjectRepository(Consulta)
    private consultaRepo: Repository<Consulta>,
    @InjectRepository(Cita)
    private citaRepo: Repository<Cita>,
  ) { }

  async create(createConsultaDto: CreateConsultaDto) {
    const { id_historia, id_medico, id_cita, ...bodyConsulta } = createConsultaDto;

    const consultaToCreate = {
      ...bodyConsulta,
      historia: { id: id_historia },
      medico: { id: id_medico },
      fecha_creacion: new Date(),
      estado: ESTADO_CONSULTA.FINALIZADO,
    };

    if (id_cita) {
      const cita = await this.citaRepo.findOneBy({ id: id_cita });
      if (!cita) throw new NotFoundException(`La cita con ID ${id_cita} no fue encontrada.`);
      consultaToCreate['cita'] = { id: id_cita };
    }

    const newConsulta = this.consultaRepo.create(consultaToCreate);
    const savedConsulta = await this.consultaRepo.save(newConsulta);

    if (id_cita) {
      await this.citaRepo.update({ id: id_cita }, { estado: EstadoCita.COMPLETADA });
    }

    return this.findOne(savedConsulta.id);
  }

  async findConsultasDeHoy(): Promise<Consulta[]> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const mañana = new Date();
    mañana.setHours(23, 59, 59, 999);

    return this.consultaRepo.find({
      where: { fecha_atencion: Between(hoy, mañana) },
    });
  }

  async findAll(): Promise<Consulta[]> {
    return this.consultaRepo.find({
      relations: ['historia', 'medico', 'historia.paciente'],
      order: {
        fecha_atencion: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const consulta = await this.consultaRepo.findOne({
      where: { id },
      relations: ['historia', 'medico', 'historia.paciente'],
    });
    if (!consulta) throw new NotFoundException("No se encontro la consulta con ese id");
    return consulta;
  }

  async listByHistoria(id: number) {
    const consultas = await this.consultaRepo.find({
      where: { historia: { id: id } },
      relations: ['medico'],
      order: { fecha_atencion: 'DESC' }
    });
    return consultas;
  }

  async update(id: number, updateConsultaDto: UpdateConsultaDto) {
    const consulta = await this.consultaRepo.findOne({ where: { id } });
    if (!consulta) throw new NotFoundException(`Consulta con id ${id} no encontrada`);

    Object.assign(consulta, updateConsultaDto);
    await this.consultaRepo.save(consulta);

    return this.findOne(id);
  }

  async finish(id: number) {
    const finished = await this.consultaRepo.update({ id }, { estado: ESTADO_CONSULTA.FINALIZADO });
    if (finished.affected === 0) throw new BadRequestException("No se pudo finalizar la consulta");
    return { message: `Se finalizó correctamente la consulta con id ${id}`, success: true };
  }

  async remove(id: number) {
    const deleteConsulta = await this.consultaRepo.delete({ id });
    if (deleteConsulta.affected === 0) throw new BadRequestException("No se eliminó ninguna consulta");
    return { message: `Se eliminó la consulta con id: ${id}`, success: true };
  }
}