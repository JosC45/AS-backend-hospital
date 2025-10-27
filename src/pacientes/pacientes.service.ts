import { BadRequestException, Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
import { HistoriasService } from 'src/historias/historias.service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PacientesService implements OnModuleInit {
  constructor(
    private readonly historiaService:HistoriasService,
    @Inject('REDIS_CLIENT') private client:ClientProxy,

    @InjectRepository(Paciente)
    private pacienteRepo:Repository<Paciente>
  ){
  }
  async onModuleInit() {
    console.log('🚀 PacienteService iniciado, contando pacientes...');
    await this.countPacientes();
  }

  emitirEvento() {
    this.client.emit('test_channel', { message: 'Prueba de evento' });
  }


  async create(createPacienteDto: CreatePacienteDto) {
    const newPaciente=this.pacienteRepo.create(createPacienteDto)
    const {id}=await this.pacienteRepo.save(newPaciente)
    const response=await this.historiaService.create(id)
    await this.countPacientes()
    return `Se agrego un nuevo paciente,${response}`;
  }

  async countPacientes(){
    const [,numPacientes]=await this.pacienteRepo.findAndCount()
    this.client.emit('cantidad_pacientes',{
      total: numPacientes,
      source: 'pacientes_service',
      updatedAt: new Date(),
    })
    console.log('🔴 Emitiendo cantidad_pacientes:', numPacientes);

  }
  async findAll() {
    const listPacientes=await this.pacienteRepo.find()
    if(listPacientes.length===0)throw new NotFoundException("No se encuentran pacientes")
    return listPacientes;
  }

  async findOne(id: number) {
    const onePaciente=await this.pacienteRepo.findOne({where:{id},relations:['id_historia']})
    if(!onePaciente)throw new NotFoundException("No se encontro el paciente")
    return onePaciente
  }
  async listNameByHistoria(id:number){
    const onePaciente=await this.pacienteRepo.findOne({where:{historia:{id}}})
    if(!onePaciente)throw new NotFoundException("No se encontro el paciente")
    const nombre=`${onePaciente.nombres} ${onePaciente.apellidos}`
   return nombre
  } 

  async update(id: number, updatePacienteDto: UpdatePacienteDto) {
    const updatePaciente=await this.pacienteRepo.update({id},{...updatePacienteDto})
    if(updatePaciente.affected===0)throw new BadRequestException("No se actualizo ningun paciente")
    return `Se actualizo correctamente el paciente con id: ${id}`;
  }

  async remove(id: number) {
    const responseHistoria=await this.historiaService.removeByPaciente(id)
    const deletedPaciente=await this.pacienteRepo.delete({id})
    if(deletedPaciente.affected===0)throw new BadRequestException("No se elimino ningun paciente")
    return `Se elimino el paciente con id: ${id},${responseHistoria}`;
  }
}
