import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrdeneDto } from './dto/create-ordene.dto';
import { UpdateOrdeneDto } from './dto/update-ordene.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Orden } from './entities/orden.entity';
import { Repository } from 'typeorm';
import { Medicamento } from './entities/medicamentos.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';

@Injectable()
export class OrdenesService {
  constructor(
    @InjectRepository(Orden)
    private ordenRepo:Repository<Orden>,

    @InjectRepository(Medicamento)
    private medicamentoRepo:Repository<Medicamento>,

    @InjectRepository(Paciente)
    private pacienteRepo:Repository<Paciente>,
  ){}
  
  async create(createOrdeneDto: CreateOrdeneDto) {
    const { id_paciente, medicamentos, ...datosOrden } = createOrdeneDto;

  const paciente = await this.pacienteRepo.findOneBy({ id: id_paciente });

  const nuevaOrden = this.ordenRepo.create({
    ...datosOrden,
    paciente:{id:id_paciente},
  });

  // Guardamos la orden primero para tener su ID
  const ordenGuardada = await this.ordenRepo.save(nuevaOrden);

  // Creamos los medicamentos vinculados a la orden
  const medicamentosInstancias = medicamentos.map((med) =>
    this.medicamentoRepo.create({
      ...med,
      orden: ordenGuardada,
    }),
  );

  await this.medicamentoRepo.save(medicamentosInstancias);

  return ordenGuardada;
  }


  async findAll() {
    return await this.ordenRepo.find({
      relations: ['paciente', 'medicamento'],
      order: {
        fecha_creacion: 'DESC', // opcional, para ver las más recientes primero
      },
    });;
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

    // Actualizar campos simples
    this.ordenRepo.merge(orden, updateDto);

    // Eliminar medicamentos anteriores (si deseas reemplazarlos)
    if (updateDto.medicamentos) {
      await this.medicamentoRepo.remove(orden.medicamento);
      const nuevosMedicamentos = updateDto.medicamentos.map(m =>
        this.medicamentoRepo.create({ ...m, orden })
      );
      await this.medicamentoRepo.save(nuevosMedicamentos);
    }

    return this.ordenRepo.save(orden);
  }


  async remove(id: number) {
    const orden = await this.ordenRepo.findOne({
      where: { id },
      relations: ['medicamento'],
    });

    if (!orden) throw new NotFoundException('Orden no encontrada');

    await this.medicamentoRepo.remove(orden.medicamento); // eliminar medicamentos
    await this.ordenRepo.remove(orden); // eliminar orden
    return { message: 'Orden eliminada correctamente' };
  }
}
