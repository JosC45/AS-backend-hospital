import { Test, TestingModule } from '@nestjs/testing';
import { MedicosService } from './medicos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Medico } from './entities/medico.entity';
import { Repository } from 'typeorm';
import { UsuarioService } from '../usuario/usuario.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findAndCount: jest.fn(),
  findOneByOrFail: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const mockUsuario = () => ({ createUserByRol: jest.fn() });
const mockClient = () => ({ emit: jest.fn() });

describe('MedicosService', () => {
  let service: MedicosService;
  let repo: jest.Mocked<Repository<Medico>>;
  let usuario: jest.Mocked<UsuarioService>;
  let client: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicosService,
        { provide: 'REDIS_CLIENT', useFactory: mockClient },
        { provide: UsuarioService, useFactory: mockUsuario },
        { provide: getRepositoryToken(Medico), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get(MedicosService);
    repo = module.get(getRepositoryToken(Medico));
    usuario = module.get(UsuarioService);
    client = module.get('REDIS_CLIENT');
  });

  describe('create', () => {
    it('crea medico, usuario y emite conteo', async () => {
      usuario.createUserByRol.mockResolvedValue({ id: 9 } as any);
      const entity = { id: 1 } as Medico;
      repo.create.mockReturnValue(entity);
      repo.save.mockResolvedValue(entity);
      repo.findAndCount.mockResolvedValue([[], 1] as any);

      const res = await service.create({ correo: 'a@a', dni: '1' } as any);
      expect(usuario.createUserByRol).toHaveBeenCalled();
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      expect(client.emit).toHaveBeenCalled();
      expect(res).toContain('El medico fue creado');
    });
  });

  describe('findAll', () => {
    it('retorna lista o NotFound', async () => {
      repo.find.mockResolvedValue([{} as any]);
      const ok = await service.findAll();
      expect(ok.length).toBe(1);
      repo.find.mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('retorna o NotFound', async () => {
      repo.findOneByOrFail.mockResolvedValue({ id: 1 } as any);
      const ok = await service.findOne(1);
      expect(ok.id).toBe(1);
      repo.findOneByOrFail.mockRejectedValue(new Error('no'));
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('actualiza si afectó', async () => {
      repo.update.mockResolvedValue({ affected: 1 } as any);
      const res = await service.update(1, {} as any);
      expect(res).toContain('Se actualizo el medico');
    });
    it('lanza BadRequest si no afectó', async () => {
      repo.update.mockResolvedValue({ affected: 0 } as any);
      await expect(service.update(1, {} as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('elimina si afectó', async () => {
      repo.delete.mockResolvedValue({ affected: 1 } as any);
      const res = await service.remove(1);
      expect(res).toContain('Se elimino el medico');
    });
    it('lanza BadRequest si no afectó', async () => {
      repo.delete.mockResolvedValue({ affected: 0 } as any);
      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });
  });
});
