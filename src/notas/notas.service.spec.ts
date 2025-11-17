import { Test, TestingModule } from '@nestjs/testing';
import { NotasService } from './notas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Nota } from './entities/nota.entity';
import { Hospitalizacion } from '../hospitalizacion/entities/hospitalizacion.entity';
import { Medico } from '../medicos/entities/medico.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
});

describe('NotasService', () => {
  let service: NotasService;
  let notaRepo: jest.Mocked<Repository<Nota>>;
  let hospRepo: jest.Mocked<Repository<Hospitalizacion>>;
  let medRepo: jest.Mocked<Repository<Medico>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotasService,
        { provide: getRepositoryToken(Nota), useFactory: mockRepo },
        { provide: getRepositoryToken(Hospitalizacion), useFactory: mockRepo },
        { provide: getRepositoryToken(Medico), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get(NotasService);
    notaRepo = module.get(getRepositoryToken(Nota));
    hospRepo = module.get(getRepositoryToken(Hospitalizacion));
    medRepo = module.get(getRepositoryToken(Medico));
  });

  describe('create', () => {
    it('crea nota con entidades relacionadas', async () => {
      const hospitalizacion = { id: 1 } as Hospitalizacion;
      const medico = { id: 2 } as Medico;
      hospRepo.findOne.mockResolvedValue(hospitalizacion);
      medRepo.findOne.mockResolvedValue(medico);

      const nota = { id: 1 } as Nota;
      notaRepo.create.mockReturnValue(nota);
      notaRepo.save.mockResolvedValue(nota);

      const res = await service.create({ descripcion: 'd', id_hospitalizacion: 1, id_medico: 2 } as any);
      expect(hospRepo.findOne).toHaveBeenCalled();
      expect(medRepo.findOne).toHaveBeenCalled();
      expect(notaRepo.create).toHaveBeenCalled();
      expect(notaRepo.save).toHaveBeenCalled();
      expect(res).toBe(nota);
    });

    it('lanza NotFound si no existe hospitalización', async () => {
      hospRepo.findOne.mockResolvedValue(null as any);
      await expect(service.create({ id_hospitalizacion: 1, id_medico: 2 } as any)).rejects.toThrow(NotFoundException);
    });

    it('lanza NotFound si no existe médico', async () => {
      hospRepo.findOne.mockResolvedValue({ id: 1 } as any);
      medRepo.findOne.mockResolvedValue(null as any);
      await expect(service.create({ id_hospitalizacion: 1, id_medico: 2 } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('lista por id hospitalizacion o NotFound', async () => {
      notaRepo.find.mockResolvedValue([{} as any]);
      const ok = await service.findOne(1);
      expect(ok.length).toBe(1);

      notaRepo.find.mockResolvedValue([]);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});
