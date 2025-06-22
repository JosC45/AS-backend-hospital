import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHistoriaDto } from './dto/create-historia.dto';
import { UpdateHistoriaDto } from './dto/update-historia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Historia } from './entities/historia.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HistoriasService {
  constructor(
    @InjectRepository(Historia)
    private historiaRepo:Repository<Historia>
  ){}

  async create(createHistoriaDto: CreateHistoriaDto) {
    const {id_paciente,id_medico,...bodyHistoria}=createHistoriaDto
    const newHistoria=this.historiaRepo.create({...bodyHistoria,paciente:{id:id_paciente},medico:{id:id_medico},fecha_creacion:new Date()})
    await this.historiaRepo.save(newHistoria)
    return 'Se agrego la historia clinica';
  }

  async findAll() {
    const listHistorias=await this.historiaRepo.find()
    if(listHistorias.length===0)throw new NotFoundException("No se encontraron historias")
    return listHistorias;
  }

  async findOne(id: number) {
    try{
      const oneHistoria=await this.historiaRepo.findOneByOrFail({id})
      return oneHistoria
    }catch(err){
      throw new NotFoundException(`No se encontro una historia clinica con id :${id}`)
    }
  }

  async update(id: number, updateHistoriaDto: UpdateHistoriaDto) {
    const search=await this.historiaRepo.findOneBy({id})
    if(!search)throw new NotFoundException(`No se encontro una historia clinica con id :${id}`)
    if(updateHistoriaDto.id_medico) search.paciente={id:updateHistoriaDto.id_medico} as any;
    if(updateHistoriaDto.id_paciente) search.medico={id:updateHistoriaDto.id_paciente} as any;

    Object.assign(search,updateHistoriaDto)
    await this.historiaRepo.save(search)
    return `Se actualizó correctamente el triage con id: #${id}`;
  }

  async remove(id: number) {
    const deleted=await this.historiaRepo.delete(id)
    if(deleted.affected===0)throw new BadRequestException("No se elimino ninguna historia clinica")
    return `Se elimino correctamente la historia clinicac con id: ${id}`;
  }
}
