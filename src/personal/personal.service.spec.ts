import { Test, TestingModule } from '@nestjs/testing';
import { PersonalService } from './personal.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Personal } from './entities/personal.entity';
import { Repository } from 'typeorm';
import { UsuarioService } from '../usuario/usuario.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneByOrFail: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const mockUsuarioService = () => ({
  createUserByRol: jest.fn(),
});

describe('PersonalService', () => {
  let service: PersonalService;
  let repo: jest.Mocked<Repository<Personal>>;
  let usuarioService: jest.Mocked<UsuarioService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonalService,
        { provide: UsuarioService, useFactory: mockUsuarioService },
        { provide: getRepositoryToken(Personal), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get(PersonalService);
    repo = module.get(getRepositoryToken(Personal));
    usuarioService = module.get(UsuarioService);
  });

  describe('create', () => {
    it('crea personal y usuario', async () => {
      usuarioService.createUserByRol.mockResolvedValue({ id: 5 } as any);
      const entity = { id: 1 } as Personal;
      repo.create.mockReturnValue(entity);
      repo.save.mockResolvedValue(entity);
      const res = await service.create({ correo: 'a@a', dni: '1' } as any);
      expect(usuarioService.createUserByRol).toHaveBeenCalled();
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      expect(res).toContain('El personal fue creado');
    });
  });

  describe('findAll', () => {
    it('retorna lista', async () => {
      repo.find.mockResolvedValue([{} as any]);
      const res = await service.findAll();
      expect(res.length).toBe(1);
    });
    it('lanza NotFound si vacío', async () => {
      repo.find.mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('retorna uno', async () => {
      repo.findOneByOrFail.mockResolvedValue({ id: 1 } as any);
      const res = await service.findOne(1);
      expect(res.id).toBe(1);
    });
    it('lanza NotFound si falla', async () => {
      repo.findOneByOrFail.mockRejectedValue(new Error('not found'));
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('actualiza si afectó', async () => {
      repo.update.mockResolvedValue({ affected: 1 } as any);
      const res = await service.update(1, {} as any);
      expect(res).toContain('Se actualizo el registro');
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
      expect(res).toContain('Se elimino el personal');
    });
    it('lanza NotFound si no afectó', async () => {
      repo.delete.mockResolvedValue({ affected: 0 } as any);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
