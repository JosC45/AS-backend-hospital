import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHospitalizacionDto } from './dto/create-hospitalizacion.dto';
import { UpdateHospitalizacionDto } from './dto/update-hospitalizacion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AREA_DESTINO, Estado_Hospitalizacion, Hospitalizacion, INTERVENCION } from './entities/hospitalizacion.entity';
import { darAltaDto } from './dto/dar-alta.dto';
import { TriagesService } from 'src/triages/triages.service';
import { ConsultasService } from 'src/consultas/consultas.service';
import { PacientesService } from 'src/pacientes/pacientes.service';
import { Camas, ESTADO_CAMA } from './entities/camas.entity';

@Injectable()
export class HospitalizacionService {
  constructor(
    private readonly triageService:TriagesService,
    private readonly consultaService:ConsultasService,
    private readonly pacienteService:PacientesService,

    @InjectRepository(Camas)
    private camaRepo:Repository<Camas>,

    @InjectRepository(Hospitalizacion)
    private hospitalizacionRepo:Repository<Hospitalizacion>
  ){}
  async create(createHospitalizacionDto: CreateHospitalizacionDto) {
    const { id_cama, id_medico, ...bodyHospitalizacion } = createHospitalizacionDto;

    const cama = await this.camaRepo.findOneBy({ id: id_cama });
    if (!cama) {
      throw new NotFoundException(`La cama con ID ${id_cama} no existe.`);
    }

    if (cama.estado !== ESTADO_CAMA.DISPONIBLE) {
      throw new BadRequestException(`La cama ${cama.cama} no está disponible. Estado actual: ${cama.estado}`);
    }

    cama.estado = ESTADO_CAMA.OCUPADA;

    const newHospitalizacion = this.hospitalizacionRepo.create({
      ...bodyHospitalizacion,
      medico: { id: id_medico },
      cama: cama,
    });

    await this.camaRepo.save(cama);
    await this.hospitalizacionRepo.save(newHospitalizacion);

    return {message: 'Se añadió una nueva hospitalización y la cama fue marcada como ocupada.'};
  }
  async getCantidadCamasPorEstado() {
    const totalDisponibles = await this.camaRepo.count({
      where: { estado: ESTADO_CAMA.DISPONIBLE },
    });
  
    const totalOcupadas = await this.camaRepo.count({
      where: { estado: ESTADO_CAMA.OCUPADA },
    });
  
    const totalMantenimiento = await this.camaRepo.count({
      where: { estado: ESTADO_CAMA.MANTENIMIENTO },
    });
  
    return {
      disponibles: totalDisponibles,
      ocupadas: totalOcupadas,
      mantenimiento: totalMantenimiento,
    };
  }

  async findAll() {
    const listHospitalizaciones=await this.hospitalizacionRepo.find()
    if(listHospitalizaciones.length===0)throw new NotFoundException("No se encontraron hospitalizaciones")
    
    return listHospitalizaciones;
  }
  
  async findByArea(area_destino:AREA_DESTINO){
    const listHospitalizacion=await this.hospitalizacionRepo.find({where:{area_destino},relations:['cama','medico'],select:['id','diagnostico_ingreso','fecha_ingreso','area_destino','cama','intervencion','id_intervencion']})
    if(!listHospitalizacion)throw new NotFoundException("No hay hospitalizaciones en esta area")
    const hospitalizaciones=Promise.all(listHospitalizacion.map(async(hospit)=>{
      let id
      if(hospit.intervencion===INTERVENCION.TRIAJE){
        const object_intervencion=await this.consultaService.findOne(hospit.id_intervencion)
        id=object_intervencion.historia.id
      }
      if(hospit.intervencion===INTERVENCION.CONSULTA){
        const object_intervencion=await this.triageService.listOne(hospit.id_intervencion)
        id=object_intervencion.historia.id
      }
      const nombres=await this.pacienteService.listNameByHistoria(id)
      return({
        "id":hospit.id,
        "nombres":nombres,
        "diagnostico_ingreso":hospit.diagnostico_ingreso,
        "nombre_medico":hospit.medico.nombres,
        "apellido_medico":hospit.medico.apellidos,
        "fecha_ingreso":hospit.fecha_ingreso,
        "cama":hospit.cama.cama,
        "area_destino":hospit.area_destino
      })
      }))
      return hospitalizaciones
  }

  async findOne(id: number) {
    try{
      const oneHospitalizacion=await this.hospitalizacionRepo.findOneByOrFail({id})
      return oneHospitalizacion
    }catch(err){
      throw new NotFoundException(`No se encontro hospitalizaciones con el id: ${id}`)
    }
  }

  async findAlta(){
    const listAlta=await this.hospitalizacionRepo.find({where:{estado:Estado_Hospitalizacion.ALTA},relations:['medico'],select:['id','diagnostico_alta','fecha_salida','intervencion','id_intervencion']})
    if(!listAlta)throw new NotFoundException("No hay hospitalizaciones en estado de alta")
      const alta=Promise.all(listAlta.map(async(hospit)=>{
        let id
        if(hospit.intervencion===INTERVENCION.TRIAJE){
          const object_intervencion=await this.consultaService.findOne(hospit.id_intervencion)
          id=object_intervencion.historia.id
        }
        if(hospit.intervencion===INTERVENCION.CONSULTA){
          const object_intervencion=await this.triageService.listOne(hospit.id_intervencion)
          id=object_intervencion.historia.id
        }
        const nombres=await this.pacienteService.listNameByHistoria(id)
        return({
          "id":hospit.id,
          "nombres":nombres,
          "diagnostico_ingreso":hospit.diagnostico_alta,
          "nombre_medico":hospit.medico.nombres,
          "apellido_medico":hospit.medico.apellidos,
          "fecha_salida":hospit.fecha_salida,
        })
        }))

        return alta
  }

  async findAllActive() {
    const listHospitalizacion = await this.hospitalizacionRepo.find({
      where: { estado: Estado_Hospitalizacion.HOSPITALIZADO },
      relations: ['cama', 'medico'],
    });

    if (listHospitalizacion.length === 0) {
      return [];
    }
    
    const hospitalizaciones = Promise.all(
      listHospitalizacion.map(async (hospit) => {
        let historiaId;
        if (hospit.intervencion === INTERVENCION.CONSULTA) {
          const object_intervencion = await this.consultaService.findOne(hospit.id_intervencion);
          historiaId = object_intervencion.historia.id;
        }
        if (hospit.intervencion === INTERVENCION.TRIAJE) {
          const object_intervencion = await this.triageService.listOne(hospit.id_intervencion);
          historiaId = object_intervencion.historia.id;
        }

        const paciente = await this.pacienteService.findPacienteByHistoria(historiaId);

        return {
          id: hospit.id,
          paciente: paciente,
          diagnosticoIngreso: hospit.diagnostico_ingreso,
          medicoTratante: `${hospit.medico.nombres} ${hospit.medico.apellidos}`,
          fechaIngreso: hospit.fecha_ingreso,
          cama: hospit.cama.cama,
          area: hospit.area_destino,
          estado: hospit.estado,
          diagnostico_alta: hospit.diagnostico_alta,
          diagnostico_secundario: hospit.diagnostico_secundario,
          tratamiento_realizado: hospit.tratamiento_realizado,
          recomendaciones_hogar: hospit.recomendaciones_hogar,
          pronostico: hospit.pronostico,
          fecha_salida: hospit.fecha_salida
        };
      }),
    );
    return hospitalizaciones;
  }

  async findCamasDisponibles(): Promise<Camas[]> {
    return this.camaRepo.find({
      where: { estado: ESTADO_CAMA.DISPONIBLE },
      order: { piso: 'ASC', cama: 'ASC' },
    });
  }

  async update(id: number, updateHospitalizacionDto: UpdateHospitalizacionDto) {
    const hospitalizacion=await this.findOne(id)
    if(updateHospitalizacionDto.id_medico) hospitalizacion.medico={id:updateHospitalizacionDto.id_medico} as any;
    if(updateHospitalizacionDto.id_cama) hospitalizacion.cama={id:updateHospitalizacionDto.id_cama} as any

    Object.assign(hospitalizacion,updateHospitalizacionDto)

    await this.hospitalizacionRepo.save(hospitalizacion)
    return `Se actualizo la hospitalizacion con id :${id}`;
  }

  async remove(id: number) {
    const hospitalizacion=await this.findOne(id)
    if(hospitalizacion){
      await this.hospitalizacionRepo.delete(id)
      return `Se elimino el registro con id: ${id}`;
    }
  }

  async changeState(id:number,bodyAlta:darAltaDto){
    const hospitalizacion=await this.findOne(id)
    if(hospitalizacion.estado===Estado_Hospitalizacion.ALTA)throw new BadRequestException("Esta hospitalizacion ya esta dada de alta")
    hospitalizacion.estado=Estado_Hospitalizacion.ALTA
    hospitalizacion.fecha_salida=new Date()
    Object.assign(hospitalizacion,bodyAlta)
    await this.hospitalizacionRepo.save(hospitalizacion)
    return `Se dio de alta al paciente con id ${id}`
  }

  
}
