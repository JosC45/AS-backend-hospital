import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nota } from './entities/nota.entity';
import { CreateNotaDto } from './dto/create-nota.dto';
import { Hospitalizacion } from 'src/hospitalizacion/entities/hospitalizacion.entity';
import { Medico } from 'src/medicos/entities/medico.entity';

@Injectable()
export class NotasService {
  constructor(
    @InjectRepository(Nota)
    private readonly notaRepository: Repository<Nota>,

    @InjectRepository(Hospitalizacion)
    private readonly hospitalizacionRepository: Repository<Hospitalizacion>,

    @InjectRepository(Medico)
    private readonly medicoRepository: Repository<Medico>,
  ) {}

  async create(createNotaDto: CreateNotaDto): Promise<Nota> {
    const { descripcion, id_hospitalizacion, id_medico } = createNotaDto;
  
    const hospitalizacion = await this.hospitalizacionRepository.findOne({ where: { id: id_hospitalizacion } });
    if (!hospitalizacion) {
      throw new NotFoundException(`Hospitalización con ID ${id_hospitalizacion} no encontrada`);
    }
  
    const medico = await this.medicoRepository.findOne({ where: { id: id_medico } });
    if (!medico) {
      throw new NotFoundException(`Médico con ID ${id_medico} no encontrado`);
    }
  
    const nota = this.notaRepository.create({
      descripcion,
      fecha_creacion: new Date(),
      hospitalizacion,
      medico,
    });
  
    return this.notaRepository.save(nota);
  }

  findAll() {
    return `This action returns all notas`;
  }

  async findOne(id: number) {
    const listNotas=await this.notaRepository.find({where:{hospitalizacion:{id:id}}})
    if(listNotas.length===0)throw new NotFoundException(`No se encontro notas para el id ${id}`)
    return listNotas;
  }

  // update(id: number, updateNotaDto: UpdateNotaDto) {
  //   return `This action updates a #${id} nota`;
  // }

  remove(id: number) {
    return `This action removes a #${id} nota`;
  }
}
