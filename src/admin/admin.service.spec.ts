import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { UsuarioService } from '../usuario/usuario.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
});

const mockUsuario = () => ({
  createUserByRol: jest.fn(),
});

describe('AdminService', () => {
  let service: AdminService;
  let repo: jest.Mocked<Repository<Admin>>;
  let usuario: jest.Mocked<UsuarioService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: UsuarioService, useFactory: mockUsuario },
        { provide: getRepositoryToken(Admin), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get(AdminService);
    repo = module.get(getRepositoryToken(Admin));
    usuario = module.get(UsuarioService);
  });

  describe('create', () => {
    it('crea admin y usuario', async () => {
      usuario.createUserByRol.mockResolvedValue({ id: 7 } as any);
      const entity = { id: 1 } as Admin;
      repo.create.mockReturnValue(entity);
      repo.save.mockResolvedValue(entity);

      const res = await service.create({ correo: 'a@a', dni: '1' } as any);
      expect(usuario.createUserByRol).toHaveBeenCalled();
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      expect(res).toContain('El admin fue creado');
    });
  });
});
