import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrdeneDto } from './dto/create-ordene.dto';
import { UpdateOrdeneDto } from './dto/update-ordene.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Orden } from './entities/orden.entity';
import { Repository } from 'typeorm';
import { Medicamento } from './entities/medicamentos.entity';

@Injectable()
export class OrdenesService {
  constructor(
    @InjectRepository(Orden)
    private ordenRepo: Repository<Orden>,
    @InjectRepository(Medicamento)
    private medicamentoRepo: Repository<Medicamento>,
  ) {}
  
  async create(createOrdeneDto: CreateOrdeneDto) {
    const { id_paciente, medicamentos, ...ordenData } = createOrdeneDto;

    const nuevaOrden = this.ordenRepo.create({
      ...ordenData,
      paciente: { id: id_paciente },
      medicamento: medicamentos.map(medDto => this.medicamentoRepo.create({
        ...medDto,
        dosis: medDto.dosis
      })),
    });

    const ordenGuardada = await this.ordenRepo.save(nuevaOrden);

    return this.ordenRepo.findOne({
        where: { id: ordenGuardada.id },
        relations: ['paciente', 'medicamento']
    });
  }

  async findAll() {
    return await this.ordenRepo.find({
      relations: ['paciente', 'medicamento'],
      order: {
        fecha_creacion: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const orden = await this.ordenRepo.findOne({
      where: { id },
      relations: ['paciente', 'medicamento'],
    });
    if (!orden) throw new NotFoundException('Orden no encontrada');
    return orden;
  }

  async update(id: number, updateDto: UpdateOrdeneDto) {
    const orden = await this.ordenRepo.findOne({
      where: { id },
      relations: ['medicamento'],
    });

    if (!orden) throw new NotFoundException('Orden no encontrada');
    this.ordenRepo.merge(orden, updateDto);

    if (updateDto.medicamentos) {
      await this.medicamentoRepo.remove(orden.medicamento);
      const nuevosMedicamentos = updateDto.medicamentos.map(m =>
        this.medicamentoRepo.create({ ...m, dosis: m.dosis, orden })
      );
      orden.medicamento = await this.medicamentoRepo.save(nuevosMedicamentos);
    }

    return this.ordenRepo.save(orden);
  }

  async remove(id: number) {
    const orden = await this.ordenRepo.findOneBy({ id });
    if (!orden) {
      throw new NotFoundException('Orden no encontrada');
    }
    await this.ordenRepo.remove(orden); 
    
    return { message: `Orden ${id} eliminada correctamente`, success: true };
  }
}