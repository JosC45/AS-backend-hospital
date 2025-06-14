import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTriageDto } from './dto/create-triage.dto';
import { UpdateTriageDto } from './dto/update-triage.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Triage } from './entities/triage.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TriagesService {
  constructor(
    @InjectRepository(Triage)
    private triageRepo:Repository<Triage>
  ){}
  async create(createTriageDto: CreateTriageDto) {
    const { id_paciente, ...triageData } = createTriageDto;
    const newTriage=this.triageRepo.create({...triageData,paciente:{id:createTriageDto.id_paciente}})
    await this.triageRepo.save(newTriage)
    return 'Se añadio correctamente el nuevo triage';
  }

  async findAll() {
    const listTriages=await this.triageRepo.find()
    if(listTriages.length===0)throw new NotFoundException("No se encontro triages")
    return listTriages;
  }

  async findOne(id: number) {
    const OneTriage=await this.triageRepo.findOneByOrFail({id})
    return OneTriage;
  }

  async update(id: number, updateTriageDto: UpdateTriageDto) {
    const triage = await this.triageRepo.findOne({ where: { id } });
    if (!triage) throw new NotFoundException(`Triage con id ${id} no encontrado`);

    if (updateTriageDto.id_paciente) triage.paciente = { id: updateTriageDto.id_paciente } as any;
    
    Object.assign(triage, updateTriageDto);
    await this.triageRepo.save(triage);

    return `Se actualizó correctamente el triage con id: #${id}`;
  }

  async remove(id: number) {
    const deletedTriage=await this.triageRepo.delete({id})
    if(deletedTriage.affected===0)throw new NotFoundException("No se elimino ningun registro")
    return `See eleimino el triage con id #${id}`;
  }
}
