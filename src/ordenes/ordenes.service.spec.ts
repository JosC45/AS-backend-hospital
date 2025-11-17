import { Test, TestingModule } from '@nestjs/testing';
import { OrdenesService } from './ordenes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Orden } from './entities/orden.entity';
import { Medicamento } from './entities/medicamentos.entity';
import { Paciente } from '../pacientes/entities/paciente.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  remove: jest.fn(),
  merge:jest.fn()
});

describe('OrdenesService', () => {
  let service: OrdenesService;
  let ordenRepo: jest.Mocked<Repository<Orden>>;
  let medRepo: jest.Mocked<Repository<Medicamento>>;
  let pacienteRepo: jest.Mocked<Repository<Paciente>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdenesService,
        { provide: getRepositoryToken(Orden), useFactory: mockRepo },
        { provide: getRepositoryToken(Medicamento), useFactory: mockRepo },
        { provide: getRepositoryToken(Paciente), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get(OrdenesService);
    ordenRepo = module.get(getRepositoryToken(Orden));
    medRepo = module.get(getRepositoryToken(Medicamento));
    pacienteRepo = module.get(getRepositoryToken(Paciente));
  });

  describe('create', () => {
    it('crea orden y medicamentos', async () => {
      const orden = { id: 1 } as Orden;
      ordenRepo.create.mockReturnValue(orden);
      ordenRepo.save.mockResolvedValue(orden);
      medRepo.create.mockImplementation((x: any) => x as any);
      medRepo.save.mockResolvedValue({} as any);

      const res = await service.create({ id_paciente: 1, medicamentos: [{ nombre: 'm1' }] } as any);
      expect(ordenRepo.create).toHaveBeenCalled();
      expect(ordenRepo.save).toHaveBeenCalled();
      expect(medRepo.save).toHaveBeenCalled();
      expect(res).toBe(orden);
    });
  });

  describe('findAll', () => {
    it('lista con relaciones', async () => {
      ordenRepo.find.mockResolvedValue([{} as any]);
      const res = await service.findAll();
      expect(res.length).toBe(1);
    });
  });

  describe('findOne', () => {
    it('retorna si existe', async () => {
      ordenRepo.findOne.mockResolvedValue({ id: 1 } as any);
      const r = await service.findOne(1);
      expect(r.id).toBe(1);
    });
    it('lanza NotFound si no existe', async () => {
      ordenRepo.findOne.mockResolvedValue(null as any);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('actualiza y reemplaza medicamentos', async () => {
      const orden = { id: 1, medicamento: [{ id: 1 }] } as any;
      ordenRepo.findOne.mockResolvedValue(orden);
      medRepo.remove.mockResolvedValue({} as any);
      medRepo.create.mockImplementation((x: any) => x as any);
      medRepo.save.mockResolvedValue({} as any);
      ordenRepo.save.mockResolvedValue(orden);
      const res = await service.update(1, { medicamentos: [{ nombre: 'n' }] } as any);
      expect(medRepo.remove).toHaveBeenCalled();
      expect(medRepo.save).toHaveBeenCalled();
      expect(res).toBe(orden);
    });
    it('lanza NotFound si no existe', async () => {
      ordenRepo.findOne.mockResolvedValue(null as any);
      await expect(service.update(1, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('elimina en cascada', async () => {
      const orden = { id: 1, medicamento: [{ id: 1 }] } as any;
      ordenRepo.findOne.mockResolvedValue(orden);
      await service.remove(1);
      expect(medRepo.remove).toHaveBeenCalled();
      expect(ordenRepo.remove).toHaveBeenCalledWith(orden);
    });
    it('lanza NotFound si no existe', async () => {
      ordenRepo.findOne.mockResolvedValue(null as any);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
