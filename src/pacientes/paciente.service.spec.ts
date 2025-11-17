import { Test, TestingModule } from '@nestjs/testing';
import { PacientesService } from './pacientes.service';
import { HistoriasService } from '../historias/historias.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GENERO, Paciente, SEGURO } from './entities/paciente.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Historia } from '../historias/entities/historia.entity';

const mockPacienteRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const mockHistoriaService = () => ({
  create: jest.fn(),
  removeByPaciente: jest.fn(),
});

const mockClientProxy = () => ({
  emit: jest.fn(),
});

describe('PacientesService', () => {
  let service: PacientesService;
  let pacienteRepo: jest.Mocked<Repository<Paciente>>;
  let historiaService: jest.Mocked<HistoriasService>;
  let clientProxy: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacientesService,
        { provide: HistoriasService, useFactory: mockHistoriaService },
        { provide: 'REDIS_CLIENT', useFactory: mockClientProxy },
        { provide: getRepositoryToken(Paciente), useFactory: mockPacienteRepo },
      ],
    }).compile();

    service = module.get<PacientesService>(PacientesService);
    pacienteRepo = module.get(getRepositoryToken(Paciente));
    historiaService = module.get(HistoriasService);
    clientProxy = module.get('REDIS_CLIENT');
  });

  // ---------------------------------------------------------
  // CREATE
  // ---------------------------------------------------------
  describe('create()', () => {
    it('debe crear un paciente y generar una historia', async () => {
      const dto = {
        nombres: "Juan",
        apellidos: "Perez",
        dni: 12345678,
        fecha_nacimiento: new Date(),
        correo: "test@test.com",
        numero: "999999999",
        domicilio: "Av X",
        genero: GENERO.MASCULINO,
        seguro: SEGURO.ESSALUD,
        tipo_sangre: "O+",
      };
      const mockHistoria: Historia = {
        id: 1,
        fecha_creacion: new Date(),
        antecedentes_natales: "Nace normal",
        antecedentes_personales: "Sin enfermedades",
        antecedentes_familiares: "Sin historial",
        
        // Relaciones obligatorias pero no usadas → se mockean vacías
        paciente: null as any,
        triage: [],
        consulta: [],
    };

      const pacienteMock: Paciente = {
        ...dto,
        id: 1,
        historia: mockHistoria,
      };

      pacienteRepo.create.mockReturnValue(pacienteMock);
      pacienteRepo.save.mockResolvedValue(pacienteMock);

      historiaService.create.mockResolvedValue('Historia creada');

      pacienteRepo.findAndCount.mockResolvedValue([[], 1]);

      const result = await service.create(dto);

      expect(pacienteRepo.create).toHaveBeenCalledWith(dto);
      expect(pacienteRepo.save).toHaveBeenCalled();
      expect(historiaService.create).toHaveBeenCalledWith(1);
      expect(clientProxy.emit).toHaveBeenCalled();
      expect(result).toContain('Se agrego un nuevo paciente');
    });
  });

  // ---------------------------------------------------------
  // FIND ALL
  // ---------------------------------------------------------
  describe('findAll()', () => {
    it('Debe retornar lista de pacientes', async () => {
      pacienteRepo.find.mockResolvedValue([{ id: 1 } as Paciente]);

      const result = await service.findAll();
      expect(result.length).toBeGreaterThan(0);
    });

    it('Debe lanzar error si no hay pacientes', async () => {
      pacienteRepo.find.mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------------------------------------------------
  // FIND ONE
  // ---------------------------------------------------------
  describe('findOne()', () => {
    it('Debe retornar un paciente existente', async () => {
      pacienteRepo.findOne.mockResolvedValue({ id: 1 } as Paciente);

      const result = await service.findOne(1);
      expect(result.id).toBe(1);
    });

    it('Debe lanzar error si no existe', async () => {
      pacienteRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------------------------------------------------
  // LIST NAME BY HISTORIA
  // ---------------------------------------------------------
  describe('listNameByHistoria()', () => {
    it('Debe retornar el nombre completo', async () => {
      pacienteRepo.findOne.mockResolvedValue({
        nombres: 'Luis',
        apellidos: 'Gomez',
      } as Paciente);

      const result = await service.listNameByHistoria(1);
      expect(result).toBe('Luis Gomez');
    });

    it('Debe lanzar error si no existe', async () => {
      pacienteRepo.findOne.mockResolvedValue(null);

      await expect(service.listNameByHistoria(1)).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------------------------------------------------
  // UPDATE
  // ---------------------------------------------------------
  describe('update()', () => {
    it('Debe actualizar un paciente', async () => {
      pacienteRepo.update.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });

      const result = await service.update(1, { nombres: 'Nuevo' } as any);
      expect(result).toContain('Se actualizo correctamente');
    });

    it('Debe lanzar error si no se actualizó', async () => {
      pacienteRepo.update.mockResolvedValue({
        affected: 0,
        raw: [],
        generatedMaps: [],
      });

      await expect(service.update(1, {} as any)).rejects.toThrow(BadRequestException);
    });
  });

  // ---------------------------------------------------------
  // REMOVE
  // ---------------------------------------------------------
  describe('remove()', () => {
    it('Debe eliminar un paciente y su historia', async () => {
      historiaService.removeByPaciente.mockResolvedValue('Historia eliminada');

      pacienteRepo.delete.mockResolvedValue({
        affected: 1,
        raw: [],
      });

      const result = await service.remove(1);
      expect(result).toContain('Se elimino el paciente');
    });

    it('Debe lanzar error si no eliminó', async () => {
      historiaService.removeByPaciente.mockResolvedValue('Historia eliminada');

      pacienteRepo.delete.mockResolvedValue({
        affected: 0,
        raw: [],
      });

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });
  });
});
