import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
import { HistoriasService } from 'src/historias/historias.service';

@Injectable()
export class PacientesService {
  constructor(
    private readonly historiaService:HistoriasService,

    @InjectRepository(Paciente)
    private pacienteRepo:Repository<Paciente>
  ){}
  async create(createPacienteDto: CreatePacienteDto) {
      const newPaciente=this.pacienteRepo.create(createPacienteDto)
    const {id}=await this.pacienteRepo.save(newPaciente)
    const response=await this.historiaService.create(id)
    return `Se agrego un nuevo paciente,${response}`;
  }

  async findAll() {
    const listPacientes=await this.pacienteRepo.find()
    if(listPacientes.length===0)throw new NotFoundException("No se encuentran pacientes")
    return listPacientes;
  }

  async findOne(id: number) {
    const onePaciente=await this.pacienteRepo.findOneByOrFail({id})
    return onePaciente;
  }

  async update(id: number, updatePacienteDto: UpdatePacienteDto) {
    const updatePaciente=await this.pacienteRepo.update({id},{...updatePacienteDto})
    if(updatePaciente.affected===0)throw new BadRequestException("No se actualizo ningun paciente")
    return `Se actualizo correctamente el paciente con id: ${id}`;
  }

  async remove(id: number) {
    const deletedPaciente=await this.pacienteRepo.delete({id})
    if(deletedPaciente.affected===0)throw new BadRequestException("No se elimino ningun paciente")
    const responseHistoria=await this.historiaService.removeByPaciente(id)
    return `Se elimino el paciente con id: ${id},${responseHistoria}`;
  }
}
