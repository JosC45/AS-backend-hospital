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

  async create(id:number) {
    const newHistoria=this.historiaRepo.create({paciente:{id},fecha_creacion:new Date()})
    await this.historiaRepo.save(newHistoria)
    return 'Se agrego la historia clinica';
  }

  async listPaciente(){
    const listHistorias=await this.historiaRepo.find({relations:['paciente']})
    if(listHistorias.length===0)throw new NotFoundException("No se encontraron historias para el paciente")
    return listHistorias; 
  }

  async findAll() {
    const listHistorias=await this.historiaRepo.find({relations:['paciente'],select:['paciente']})
    if(listHistorias.length===0)throw new NotFoundException("No se encontraron historias")
    return listHistorias;
  }

  async findOne(id: number) {
      const oneHistoria=await this.historiaRepo.find({where:{id},relations:['paciente']})
      if(!oneHistoria)throw new NotFoundException("No se encontro la historia")
      return oneHistoria
  }

  // async update(id: number, updateHistoriaDto: UpdateHistoriaDto) {
  //   const search=await this.historiaRepo.findOneBy({id})
  //   if(!search)throw new NotFoundException(`No se encontro una historia clinica con id :${id}`)
  //   if(updateHistoriaDto.id_paciente) throw new BadRequestException("No se puede cambiar el id paciente")
  //   if(updateHistoriaDto.id_paciente) search.medico={id:updateHistoriaDto.id_paciente} as any;

  //   Object.assign(search,updateHistoriaDto)
  //   await this.historiaRepo.save(search)
  //   return `Se actualizó correctamente el triage con id: #${id}`;
  // }

  async remove(id: number) {
    const deleted=await this.historiaRepo.delete(id)
    if(deleted.affected===0)throw new BadRequestException("No se elimino ninguna historia clinica")
    return `Se elimino correctamente la historia clinica con id: ${id}`;
  }

  async removeByPaciente(id:number){
    const deleteResult = await this.historiaRepo
    .createQueryBuilder('historia')
    .leftJoin('historia.paciente', 'paciente')
    .delete()
    .where('paciente.id = :id', { id })
    .execute();

  if (deleteResult.affected === 0) {
    throw new BadRequestException("No se eliminó ningún registro");
  }

  return `Se eliminó correctamente la(s) historia(s) clínica(s) del paciente con id: ${id}`;
  }

  async updateAntecedentes(id:number,body:UpdateHistoriaDto){
    const updatedHistoria=await this.historiaRepo.update({id},body)
    if(updatedHistoria.affected===0)throw new BadRequestException("No se actualizo ningun antecedente")
    return `Se actualizaron los antecedentes de la historia clinica con id: ${id}`;
  }
}
