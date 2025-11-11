import { BadRequestException, Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
import { ClientProxy } from '@nestjs/microservices';
import { Historia } from 'src/historias/entities/historia.entity';

@Injectable()
export class PacientesService implements OnModuleInit {
  constructor(
    @Inject('REDIS_CLIENT') private client: ClientProxy,
    @InjectRepository(Paciente)
    private pacienteRepo: Repository<Paciente>,
    @InjectRepository(Historia)
    private historiaRepo: Repository<Historia>,
  ) {}

  async onModuleInit() {
    console.log('🚀 PacienteService iniciado, contando pacientes...');
    await this.countPacientes();
  }

  emitirEvento() {
    this.client.emit('test_channel', { message: 'Prueba de evento' });
  }

  async create(createPacienteDto: CreatePacienteDto) {
    const nuevaHistoria = this.historiaRepo.create({ fecha_creacion: new Date() });
    const historiaGuardada = await this.historiaRepo.save(nuevaHistoria);

    const nuevoPaciente = this.pacienteRepo.create({
      ...createPacienteDto,
      historia: historiaGuardada,
    });

    const pacienteGuardado = await this.pacienteRepo.save(nuevoPaciente);
    
    await this.countPacientes();
    
    return pacienteGuardado;
  }

  async countPacientes() {
    const [, numPacientes] = await this.pacienteRepo.findAndCount({ where: { deletedAt: IsNull() } });
    this.client.emit('cantidad_pacientes', {
      total: numPacientes,
      source: 'pacientes_service',
      updatedAt: new Date(),
    });
    console.log('🔴 Emitiendo cantidad_pacientes:', numPacientes);
  }

  async findAll() {
    const listPacientes = await this.pacienteRepo.find({
      where: { deletedAt: IsNull() },
      relations: ['historia'],
    });
    if (listPacientes.length === 0) throw new NotFoundException("No se encuentran pacientes");
    return listPacientes;
  }

  async findOne(id: number) {
    const onePaciente = await this.pacienteRepo.findOne({ where: { id, deletedAt: IsNull() }, relations: ['historia'] });
    if (!onePaciente) throw new NotFoundException("No se encontro el paciente");
    return onePaciente;
  }

  async listNameByHistoria(id: number) {
    const onePaciente = await this.pacienteRepo.findOne({ where: { historia: { id }, deletedAt: IsNull() } });
    if (!onePaciente) throw new NotFoundException("No se encontro el paciente");
    const nombre = `${onePaciente.nombres} ${onePaciente.apellidos}`;
    return nombre;
  }

  async findPacienteByHistoria(historiaId: number): Promise<Paciente> {
    const paciente = await this.pacienteRepo.findOne({
      where: { historia: { id: historiaId } },
      relations: ['historia'],
    });

    if (!paciente) {
      throw new NotFoundException(`No se encontró un paciente asociado a la historia con ID ${historiaId}`);
    }

    return paciente;
  }

  async update(id: number, updatePacienteDto: UpdatePacienteDto) {
    const updateResult = await this.pacienteRepo.update({ id }, { ...updatePacienteDto });
    if (updateResult.affected === 0) throw new BadRequestException("Paciente no encontrado para actualizar");
    const updatedPaciente = await this.findOne(id);
    return updatedPaciente;
  }

  async remove(id: number) {
    const result = await this.pacienteRepo.softDelete({ id });
    if (result.affected === 0) throw new BadRequestException("Paciente no encontrado");
    await this.countPacientes();
    return { message: `Se eliminó correctamente el paciente con id: ${id}`, success: true };
  }
}