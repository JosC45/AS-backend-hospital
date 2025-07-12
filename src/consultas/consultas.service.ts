import { BadRequestException, Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Consulta } from './entities/consulta.entity';
import { Between, Not, Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ConsultasService implements OnModuleInit {
  constructor(
    @Inject('TCP_CLIENT') private client:ClientProxy,

    @InjectRepository(Consulta)
    private consultaRepo:Repository<Consulta>
  ){}

  async onModuleInit() {
    console.log('🚀 ConsultasService iniciado, contando consultas...');
    await this.counConsultasHoy();
  }

  async create(createConsultaDto: CreateConsultaDto) {
    const {id_historia,id_medico,...bodyConsulta}=createConsultaDto
    const newConsulta=this.consultaRepo.create({...bodyConsulta,historia:{id:id_historia},medico:{id:id_medico},fecha_creacion:new Date(),estado:'proceso'})
    await this.consultaRepo.save(newConsulta)
    await this.counConsultasHoy();
    return 'Se añadio correctamente la consulta';
  }

  async findConsultasDeHoy(): Promise<Consulta[]> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 
  
    const mañana = new Date();
    mañana.setHours(23, 59, 59, 999); 
  
    const consultas = await this.consultaRepo.find({
      where: {
        fecha_atencion: Between(hoy, mañana),
      },
    });
  
    return consultas;
  }

  async counConsultasHoy(){
    const consultasHoy = await this.findConsultasDeHoy();
    this.client.emit('cantidad_consultas_hoy', {
      total: consultasHoy.length,
      source: 'consultas_service',
      updatedAt: new Date(),
    });
    console.log('🔴 Emitiendo cantidad_consultas_hoy:', consultasHoy.length);
  }

  findAll() {
    return `This action returns all consultas`;
  }

  async findOne(id: number) {
    const consulta=await this.consultaRepo.findOne({where:{id},relations:['historia']})
    if(!consulta)throw new NotFoundException("No se encontro la consulta con ese id")
    return consulta
  }

  async listByHistoria(id:number){
    const consultas=await this.consultaRepo.find({where:{id},select:['motivo_consulta','descripcion_diagnostico','codigo','tipo_diagnostico','tratamiento','fecha_atencion','fecha_creacion']})
    if(consultas.length===0)throw new NotFoundException("No se encontro consultas con ese id")
    return consultas
  }

  async update(id: number, updateConsultaDto: UpdateConsultaDto) {
    const consulta = await this.consultaRepo.findOne({ where: { id } });
    if (!consulta ) throw new NotFoundException(`Triage con id ${id} no encontrado`);

    if (updateConsultaDto.id_historia) consulta.historia = { id: updateConsultaDto.id_historia } as any;
    if(updateConsultaDto.id_medico) consulta.medico={id:updateConsultaDto.id_medico} as any;
    
    Object.assign(consulta , updateConsultaDto);
    await this.consultaRepo.save(consulta);

    return `Se actualizó correctamente la consulta con id: #${id}`;
  }

  async finish(id:number){
    const finished=await this.consultaRepo.update({id},{estado:'finalizado'})
    if(finished.affected===0)throw new BadRequestException("No se cambio ningun valor")
    return `Se finalizo correctamente la consulta con id ${id}`
  }
  async remove(id: number) {
    const deleteConsulta=await this.consultaRepo.delete({id})
    if(deleteConsulta.affected===0)throw new BadRequestException("No se elimino ningun paciente")
    return `Se elimino el paciente con id: ${id}`;
  }
}
