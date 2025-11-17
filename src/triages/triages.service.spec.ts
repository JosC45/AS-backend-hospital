import { Test, TestingModule } from '@nestjs/testing';
import { TriagesService } from './triages.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Triage } from './entities/triage.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(),
});

describe('TriagesService', () => {
  let service: TriagesService;
  let repo: jest.Mocked<Repository<Triage>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TriagesService,
        { provide: getRepositoryToken(Triage), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get(TriagesService);
    repo = module.get(getRepositoryToken(Triage));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('crea triage', async () => {
      const triage = { id: 1 } as Triage;
      repo.create.mockReturnValue(triage);
      repo.save.mockResolvedValue(triage);
      const res = await service.create({ id_historia: 2 } as any);
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalledWith(triage);
      expect(res).toContain('Se añadio correctamente');
    });
  });

  describe('findAll', () => {
    it('retorna lista', async () => {
      const getRawMany = jest.fn().mockResolvedValue([{}]);
      const getQB = {
        innerJoin: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawMany,
      } as any;
      (repo.createQueryBuilder as jest.Mock).mockReturnValue(getQB);

      const res = await service.findAll();
      expect(res.length).toBe(1);
    });
    it('lanza NotFound si vacío', async () => {
      const getRawMany = jest.fn().mockResolvedValue([]);
      (repo.createQueryBuilder as jest.Mock).mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawMany,
      } as any);
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('listOne', () => {
    it('retorna triage por id o error', async () => {
      repo.findOne.mockResolvedValue({ id: 1 } as any);
      const ok = await service.listOne(1);
      expect(ok.id).toBe(1);
      repo.findOne.mockResolvedValue(null as any);
      await expect(service.listOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('retorna datos raw', async () => {
      const getRawOne = jest.fn().mockResolvedValue({} as any);
      (repo.createQueryBuilder as jest.Mock).mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne,
      } as any);
      const res = await service.findOne(1);
      expect(res).toBeDefined();
    });
  });

  describe('listByHistoria', () => {
    it('retorna lista o NotFound', async () => {
      (repo.createQueryBuilder as jest.Mock).mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([{}]),
      } as any);
      const res = await service.listByHistoria(1);
      expect(res.length).toBe(1);

      (repo.createQueryBuilder as jest.Mock).mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      } as any);
      await expect(service.listByHistoria(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('actualiza cuando existe', async () => {
      repo.findOne.mockResolvedValue({ id: 1 } as any);
      repo.save.mockResolvedValue({} as any);
      const res = await service.update(1, {} as any);
      expect(res).toContain('Se actualizó correctamente');
    });
    it('lanza NotFound si no existe', async () => {
      repo.findOne.mockResolvedValue(null as any);
      await expect(service.update(1, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('finish', () => {
    it('finaliza si afectó', async () => {
      repo.update.mockResolvedValue({ affected: 1 } as any);
      const res = await service.finish(1);
      expect(res).toContain('Se finalizo el triage');
    });
    it('lanza BadRequest si no afectó', async () => {
      repo.update.mockResolvedValue({ affected: 0 } as any);
      await expect(service.finish(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('elimina si afectó', async () => {
      repo.delete.mockResolvedValue({ affected: 1 } as any);
      const res = await service.remove(1);
      expect(res).toContain('See eleimino');
    });
    it('lanza NotFound si no afectó', async () => {
      repo.delete.mockResolvedValue({ affected: 0 } as any);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
