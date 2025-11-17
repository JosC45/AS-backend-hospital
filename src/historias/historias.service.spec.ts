import { Test, TestingModule } from '@nestjs/testing';
import { HistoriasService } from './historias.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Historia } from './entities/historia.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockHistoriaRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  createQueryBuilder: jest.fn(),
});

describe('HistoriasService', () => {
  let service: HistoriasService;
  let repo: jest.Mocked<Repository<Historia>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoriasService,
        { provide: getRepositoryToken(Historia), useFactory: mockHistoriaRepo },
      ],
    }).compile();

    service = module.get(HistoriasService);
    repo = module.get(getRepositoryToken(Historia));
  });

  describe('create', () => {
    it('debe crear historia vinculada a paciente', async () => {
      const historia = { id: 1 } as Historia;
      repo.create.mockReturnValue(historia);
      repo.save.mockResolvedValue(historia);

      const res = await service.create(10);

      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalledWith(historia);
      expect(res).toContain('Se agrego la historia clinica');
    });
  });

  describe('listPaciente', () => {
    it('retorna lista', async () => {
      repo.find.mockResolvedValue([{} as any]);
      const res = await service.listPaciente();
      expect(res.length).toBe(1);
    });
    it('lanza NotFound si vacío', async () => {
      repo.find.mockResolvedValue([]);
      await expect(service.listPaciente()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('retorna lista', async () => {
      repo.find.mockResolvedValue([{} as any]);
      const res = await service.findAll();
      expect(Array.isArray(res)).toBe(true);
    });
    it('lanza NotFound si vacío', async () => {
      repo.find.mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('retorna historia(s)', async () => {
      repo.find.mockResolvedValue([{} as any]);
      const res = await service.findOne(1);
      expect(Array.isArray(res)).toBe(true);
    });
  });

  describe('remove', () => {
    it('elimina por id', async () => {
      (repo.delete as any).mockResolvedValue({ affected: 1 });
      const res = await service.remove(1);
      expect(res).toContain('Se elimino correctamente');
    });
    it('lanza BadRequest si no afectó', async () => {
      (repo.delete as any).mockResolvedValue({ affected: 0 });
      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('removeByPaciente', () => {
    it('elimina por paciente con QB', async () => {
      const execute = jest.fn().mockResolvedValue({ affected: 1 });
      const where = jest.fn().mockReturnValue({ execute });
      const del = jest.fn().mockReturnValue({ where });
      const leftJoin = jest.fn().mockReturnValue({ delete: del });
      const createQB = jest.fn().mockReturnValue({ leftJoin });
      (repo.createQueryBuilder as jest.Mock).mockImplementation(createQB as any);

      const res = await service.removeByPaciente(1);
      expect(res).toContain('Se eliminó correctamente');
      expect(createQB).toHaveBeenCalled();
    });
    it('lanza BadRequest si no afectó', async () => {
      const execute = jest.fn().mockResolvedValue({ affected: 0 });
      const where = jest.fn().mockReturnValue({ execute });
      const del = jest.fn().mockReturnValue({ where });
      const leftJoin = jest.fn().mockReturnValue({ delete: del });
      (repo.createQueryBuilder as jest.Mock).mockReturnValue({ leftJoin } as any);

      await expect(service.removeByPaciente(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateAntecedentes', () => {
    it('actualiza antecedentes', async () => {
      repo.update.mockResolvedValue({ affected: 1 } as any);
      const res = await service.updateAntecedentes(1, { antecedentes_natales: 'ok' } as any);
      expect(res).toContain('Se actualizaron los antecedentes');
    });
    it('lanza BadRequest si no afectó', async () => {
      repo.update.mockResolvedValue({ affected: 0 } as any);
      await expect(service.updateAntecedentes(1, {} as any)).rejects.toThrow(BadRequestException);
    });
  });
});
