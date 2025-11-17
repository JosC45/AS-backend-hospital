import { Test, TestingModule } from '@nestjs/testing';
import { HospitalizacionService } from './hospitalizacion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Camas } from './entities/camas.entity';
import { Hospitalizacion, Estado_Hospitalizacion, INTERVENCION, AREA_DESTINO } from './entities/hospitalizacion.entity';
import { TriagesService } from '../triages/triages.service';
import { ConsultasService } from '../consultas/consultas.service';
import { PacientesService } from '../pacientes/pacientes.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneByOrFail: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
});

const mockTriagesService = () => ({
  listOne: jest.fn(),
});

const mockConsultasService = () => ({
  findOne: jest.fn(),
});

const mockPacientesService = () => ({
  listNameByHistoria: jest.fn(),
});

describe('HospitalizacionService', () => {
  let service: HospitalizacionService;
  let camaRepo: jest.Mocked<Repository<Camas>>;
  let hospRepo: jest.Mocked<Repository<Hospitalizacion>>;
  let triageSrv: jest.Mocked<TriagesService>;
  let consultaSrv: jest.Mocked<ConsultasService>;
  let pacienteSrv: jest.Mocked<PacientesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HospitalizacionService,
        { provide: TriagesService, useFactory: mockTriagesService },
        { provide: ConsultasService, useFactory: mockConsultasService },
        { provide: PacientesService, useFactory: mockPacientesService },
        { provide: getRepositoryToken(Camas), useFactory: mockRepo },
        { provide: getRepositoryToken(Hospitalizacion), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get(HospitalizacionService);
    camaRepo = module.get(getRepositoryToken(Camas));
    hospRepo = module.get(getRepositoryToken(Hospitalizacion));
    triageSrv = module.get(TriagesService);
    consultaSrv = module.get(ConsultasService);
    pacienteSrv = module.get(PacientesService);
  });

  describe('create', () => {
    it('crea hospitalizacion', async () => {
      const entity = { id: 1 } as Hospitalizacion;
      hospRepo.create.mockReturnValue(entity);
      hospRepo.save.mockResolvedValue(entity);
      const res = await service.create({ id_medico: 1, id_cama: 2 } as any);
      expect(hospRepo.create).toHaveBeenCalled();
      expect(hospRepo.save).toHaveBeenCalledWith(entity);
      expect(res).toContain('Se añadio una nueva hospitalizacion');
    });
  });

  describe('getCantidadCamasPorEstado', () => {
    it('retorna totales por estado', async () => {
      camaRepo.count
        .mockResolvedValueOnce(3 as any) // DISPONIBLE
        .mockResolvedValueOnce(5 as any) // OCUPADA
        .mockResolvedValueOnce(1 as any); // MANTENIMIENTO
      const res = await service.getCantidadCamasPorEstado();
      expect(res).toEqual({ disponibles: 3, ocupadas: 5, mantenimiento: 1 });
    });
  });

  describe('findAll', () => {
    it('retorna lista o NotFound', async () => {
      hospRepo.find.mockResolvedValue([{} as any]);
      const ok = await service.findAll();
      expect(ok.length).toBe(1);
      hospRepo.find.mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByArea', () => {
    it('mapea hospitalizaciones a respuesta enriquecida (CONSULTA)', async () => {
      hospRepo.find.mockResolvedValue([
        { id: 10, intervencion: INTERVENCION.CONSULTA, id_intervencion: 4, medico: { nombres: 'Doc', apellidos: 'X' }, fecha_ingreso: new Date(), cama: { cama: 'A1' }, area_destino: AREA_DESTINO.UCI } as any,
      ]);
      triageSrv.listOne.mockResolvedValue({ historia: { id: 99 } } as any);
      pacienteSrv.listNameByHistoria.mockResolvedValue('Juan Perez');

      const res = await service.findByArea(AREA_DESTINO.UCI);
      expect(res).resolves; // returns a Promise.all
      const items = await res;
      expect(items[0].nombres).toBe('Juan Perez');
    });

    it('mapea hospitalizaciones a respuesta enriquecida (TRIAJE)', async () => {
      hospRepo.find.mockResolvedValue([
        { id: 11, intervencion: INTERVENCION.TRIAJE, id_intervencion: 5, medico: { nombres: 'Doc', apellidos: 'Y' }, fecha_ingreso: new Date(), cama: { cama: 'B2' }, area_destino: AREA_DESTINO.UCI } as any,
      ]);
      consultaSrv.findOne.mockResolvedValue({ historia: { id: 77 } } as any);
      pacienteSrv.listNameByHistoria.mockResolvedValue('Maria Lopez');

      const res = await service.findByArea(AREA_DESTINO.UCI);
      const items = await res;
      expect(items[0].nombres).toBe('Maria Lopez');
    });
  });

  describe('findOne', () => {
    it('retorna o NotFound', async () => {
      hospRepo.findOneByOrFail.mockResolvedValue({ id: 1 } as any);
      const ok = await service.findOne(1);
      expect(ok.id).toBe(1);
      hospRepo.findOneByOrFail.mockRejectedValue(new Error('no'));
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAlta', () => {
    it('arma lista de altas (CONSULTA)', async () => {
      hospRepo.find.mockResolvedValue([
        { id: 1, intervencion: INTERVENCION.CONSULTA, id_intervencion: 8, medico: { nombres: 'D', apellidos: 'Z' }, fecha_salida: new Date(), diagnostico_alta: 'dx' } as any,
      ]);
      triageSrv.listOne.mockResolvedValue({ historia: { id: 3 } } as any);
      pacienteSrv.listNameByHistoria.mockResolvedValue('Carlos Perez');
      const res = await service.findAlta();
      const items = await res;
      expect(items[0].nombres).toBe('Carlos Perez');
    });
  });

  describe('update', () => {
    it('actualiza asignando relaciones', async () => {
      const ent = { id: 1 } as any;
      jest.spyOn(service, 'findOne').mockResolvedValue(ent);
      hospRepo.save.mockResolvedValue(ent);
      const res = await service.update(1, { id_medico: 2, id_cama: 3 } as any);
      expect(hospRepo.save).toHaveBeenCalled();
      expect(res).toContain('Se actualizo la hospitalizacion');
    });
  });

  describe('remove', () => {
    it('elimina si existe', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({ id: 1 } as any);
      hospRepo.delete.mockResolvedValue({} as any);
      const res = await service.remove(1);
      expect(hospRepo.delete).toHaveBeenCalledWith(1);
      expect(res).toContain('Se elimino el registro');
    });
  });

  describe('changeState', () => {
    it('lanza BadRequest si ya está ALTA', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({ id: 1, estado: Estado_Hospitalizacion.ALTA } as any);
      await expect(service.changeState(1, {} as any)).rejects.toThrow(BadRequestException);
    });

    it('da de alta cuando procede', async () => {
      const ent: any = { id: 1, estado: Estado_Hospitalizacion.HOSPITALIZADO };
      jest.spyOn(service, 'findOne').mockResolvedValue(ent);
      hospRepo.save.mockResolvedValue(ent);
      const res = await service.changeState(1, { diagnostico_alta: 'ok' } as any);
      expect(hospRepo.save).toHaveBeenCalled();
      expect(res).toContain('Se dio de alta');
    });
  });
});
