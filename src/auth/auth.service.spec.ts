import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt');

const mockRepo = () => ({
  findOneBy: jest.fn(),
});

const mockJwt = () => ({ sign: jest.fn().mockReturnValue('jwt-token') });

describe('AuthService', () => {
  let service: AuthService;
  let repo: jest.Mocked<Repository<Usuario>>;
  let jwt: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(Usuario), useFactory: mockRepo },
        { provide: JwtService, useFactory: mockJwt },
      ],
    }).compile();

    service = module.get(AuthService);
    repo = module.get(getRepositoryToken(Usuario));
    jwt = module.get(JwtService);
  });

  describe('validateUser', () => {
    it('retorna usuario si credenciales válidas', async () => {
      repo.findOneBy.mockResolvedValue({ id: 1, username: 'u', password: 'hash' } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const res = await service.validateUser('u', 'p');
      expect(res.id).toBe(1);
    });
    it('lanza Unauthorized si inválidas', async () => {
      repo.findOneBy.mockResolvedValue({ id: 1, username: 'u', password: 'hash' } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.validateUser('u', 'p')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('firma y retorna token', async () => {
      const token = await service.login({ id: 1, username: 'u', rol: 'ADMIN' } as any);
      expect(jwt.sign).toHaveBeenCalled();
      expect(token.access_token).toBe('jwt-token');
    });
  });
});
