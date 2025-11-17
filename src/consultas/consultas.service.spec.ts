import { Test, TestingModule } from '@nestjs/testing';
import { ConsultasService } from './consultas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Consulta } from './entities/consulta.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const mockClient = () => ({ emit: jest.fn() });

describe('ConsultasService', () => {
  let service: ConsultasService;
  let repo: jest.Mocked<Repository<Consulta>>;
  let client: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultasService,
        { provide: 'REDIS_CLIENT', useFactory: mockClient },
        { provide: getRepositoryToken(Consulta), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get(ConsultasService);
    repo = module.get(getRepositoryToken(Consulta));
    client = module.get('REDIS_CLIENT');
  });

  describe('create', () => {
    it('crea consulta y emite cantidad', async () => {
      const consulta = { id: 1 } as Consulta;
      repo.create.mockReturnValue(consulta);
      repo.save.mockResolvedValue(consulta);
      repo.find.mockResolvedValue([{} as any]);

      const res = await service.create({ id_historia: 1, id_medico: 2 } as any);
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      expect(client.emit).toHaveBeenCalled();
      expect(res).toContain('Se añadio correctamente');
    });
  });

  describe('findOne', () => {
    it('retorna consulta con historia', async () => {
      repo.findOne.mockResolvedValue({ id: 1 } as any);
      const res = await service.findOne(1);
      expect(res.id).toBe(1);
    });
    it('lanza NotFound si no hay', async () => {
      repo.findOne.mockResolvedValue(null as any);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('listByHistoria', () => {
    it('lista o NotFound', async () => {
      repo.find.mockResolvedValue([{} as any]);
      const ok = await service.listByHistoria(1);
      expect(ok.length).toBe(1);
      repo.find.mockResolvedValue([]);
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
      expect(res).toContain('Se finalizo correctamente');
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
      expect(res).toContain('Se elimino el paciente');
    });
    it('lanza BadRequest si no afectó', async () => {
      repo.delete.mockResolvedValue({ affected: 0 } as any);
      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });
  });
});
