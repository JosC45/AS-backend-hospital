import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cita } from './entities/cita.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private citaRepo:Repository<Cita>
  ){}

  create(createCitaDto: CreateCitaDto) {
    const {id_paciente,id_medico,...bodyCita}=createCitaDto
    const cita=this.citaRepo.create({...bodyCita,paciente:{id:id_paciente},medico:{id:id_medico}})
    this.citaRepo.save(cita)    
    return 'Se añadio una nueva cita correctamente';
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
