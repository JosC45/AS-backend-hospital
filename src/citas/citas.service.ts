import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cita } from './entities/cita.entity';
import { Between, Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CitasService implements OnModuleInit {
  constructor(
    @Inject('REDIS_CLIENT') private client:ClientProxy,
    
    @InjectRepository(Cita)
    private citaRepo:Repository<Cita>
  ){}

  async onModuleInit() {
    console.log('🚀 CitasService iniciado, contando citas...');
    await this.countCitasHoy();
  }

  async create(createCitaDto: CreateCitaDto) {
    const {id_paciente,id_medico,...bodyCita}=createCitaDto
    const cita=this.citaRepo.create({...bodyCita,paciente:{id:id_paciente},medico:{id:id_medico}})
    await this.citaRepo.save(cita)
    await this.countCitasHoy();    
    return 'Se añadio una nueva cita correctamente';
  }

  async findCitasDeHoy(): Promise<Cita[]> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // inicio del día
  
    const finDelDia = new Date();
    finDelDia.setHours(23, 59, 59, 999); // fin del día
  
    return await this.citaRepo.find({
      where: {
        fecha_atencion: Between(hoy, finDelDia),
      },
      relations: ['paciente', 'medico'], // si necesitas traer las relaciones
    });
  }

  async countCitasHoy(){
    const consultasHoy = await this.findCitasDeHoy();
    this.client.emit('cantidad_citas_hoy', {
      total: consultasHoy.length,
      source: 'consultas_service',
      updatedAt: new Date(),
    });
    console.log('🔴 Emitiendo cantidad_citas_hoy:', consultasHoy.length);
  }

  findAll() {
    return `This action returns all citas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cita`;
  }

  update(id: number, updateCitaDto: UpdateCitaDto) {
    return `This action updates a #${id} cita`;
  }

  async remove(id: number) {
    const orden = await this.citaRepo.findOneBy({ id });
    if (!orden) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }
    await this.citaRepo.remove(orden);
  }
}
