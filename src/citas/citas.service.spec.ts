import { Test, TestingModule } from '@nestjs/testing';
import { CitasService } from './citas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cita } from './entities/cita.entity';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { NotFoundException } from '@nestjs/common';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  remove: jest.fn(),
});

const mockClient = () => ({ emit: jest.fn() });

describe('CitasService', () => {
  let service: CitasService;
  let repo: jest.Mocked<Repository<Cita>>;
  let client: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitasService,
        { provide: 'REDIS_CLIENT', useFactory: mockClient },
        { provide: getRepositoryToken(Cita), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get(CitasService);
    repo = module.get(getRepositoryToken(Cita));
    client = module.get('REDIS_CLIENT');
  });

  describe('create', () => {
    it('crea cita y emite conteo', async () => {
      const cita = { id: 1 } as Cita;
      repo.create.mockReturnValue(cita);
      repo.save.mockResolvedValue(cita);
      repo.find.mockResolvedValue([{} as any]);

      const res = await service.create({ id_paciente: 1, id_medico: 2 } as any);
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      expect(client.emit).toHaveBeenCalled();
      expect(res).toContain('Se añadio una nueva cita');
    });
  });

  describe('remove', () => {
    it('elimina cuando existe', async () => {
      repo.findOneBy.mockResolvedValue({ id: 1 } as any);
      await service.remove(1);
      expect(repo.remove).toHaveBeenCalled();
    });
    it('lanza NotFound si no existe', async () => {
      repo.findOneBy.mockResolvedValue(null as any);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
