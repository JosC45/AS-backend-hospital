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
import { Consulta, ESTADO_CONSULTA } from 'src/consultas/entities/consulta.entity';

@Injectable()
export class HospitalizacionService {
  constructor(
    @InjectRepository(Consulta)
    private readonly consultaRepo: Repository<Consulta>,

    @InjectRepository(Camas)
    private camaRepo: Repository<Camas>,

    @InjectRepository(Hospitalizacion)
    private hospitalizacionRepo: Repository<Hospitalizacion>,

    private readonly triageService: TriagesService,
    private readonly consultaService: ConsultasService,
    private readonly pacienteService: PacientesService,
  ) { }

  async testCamaRelacion(camaId: number) {
    console.log(`--- Ejecutando prueba de relación para Cama ID: ${camaId} ---`);

    const cama = await this.camaRepo.findOne({
      where: { id: camaId },
      relations: ['hospitalizaciones'], // <-- Intentamos cargar la relación desde el otro lado
    });

    if (!cama) {
      console.log('❌ PRUEBA FALLIDA: No se encontró la cama con ese ID.');
      return { error: 'Cama no encontrada' };
    }

    console.log('✅ PRUEBA EXITOSA: Se encontró la cama.');
    console.log('Datos de la cama y sus hospitalizaciones:', cama);

    return cama;
  }

  async create(createHospitalizacionDto: CreateHospitalizacionDto) {
    console.log('--- INICIO DEL PROCESO CREATE ---');
    console.log('1. DTO recibido del frontend:', createHospitalizacionDto);
    const { id_cama, id_medico, intervencion, id_intervencion, ...bodyHospitalizacion } = createHospitalizacionDto;

    let pacienteId: number;

    if (intervencion === INTERVENCION.CONSULTA) {
      const consulta = await this.consultaService.findOne(id_intervencion);
      if (!consulta || !consulta.historia) throw new NotFoundException('Consulta o historia no encontrada');

      if (consulta.estado === ESTADO_CONSULTA.HOSPITALIZACION_ORDENADA) {
        throw new BadRequestException('Esta consulta ya ha generado una orden de hospitalización y no puede ser reutilizada.');
      }

      const paciente = await this.pacienteService.findPacienteByHistoria(consulta.historia.id);
      if (!paciente) throw new NotFoundException('Paciente no encontrado para esta historia');
      pacienteId = paciente.id;

      console.log(`Actualizando estado de la Consulta ID: ${consulta.id} a 'hospitalizacion_ordenada'`);
      consulta.estado = ESTADO_CONSULTA.HOSPITALIZACION_ORDENADA;
      await this.consultaRepo.save(consulta);

    } else if (intervencion === INTERVENCION.TRIAJE) {
      const triage = await this.triageService.listOne(id_intervencion);
      if (!triage || !triage.historia) throw new NotFoundException('Triage o historia no encontrada');
      const paciente = await this.pacienteService.findPacienteByHistoria(triage.historia.id);
      if (!paciente) throw new NotFoundException('Paciente no encontrado para esta historia');
      pacienteId = paciente.id;
    } else {
      throw new BadRequestException('Tipo de intervención no válido');
    }

    const cama = await this.camaRepo.findOneBy({ id: id_cama });
    console.log(`2. Objeto 'cama' encontrado en la BD (ID: ${id_cama}):`, cama);
    if (!cama) {
      throw new NotFoundException(`La cama con ID ${id_cama} no existe.`);
    }
    if (cama.estado !== ESTADO_CAMA.DISPONIBLE) {
      throw new BadRequestException(`La cama ${cama.cama} no está disponible.`);
    }

    cama.estado = ESTADO_CAMA.OCUPADA;

    const newHospitalizacion = this.hospitalizacionRepo.create({
      ...bodyHospitalizacion,
      intervencion,
      id_intervencion,
      medico: { id: id_medico },
      cama: cama,
      paciente: { id: pacienteId }
    });

    console.log('3. Objeto Hospitalizacion ANTES de guardar:', newHospitalizacion);
    await this.camaRepo.save(cama);
    const savedHospitalizacion = await this.hospitalizacionRepo.save(newHospitalizacion);
    console.log('4. Objeto Hospitalizacion DESPUÉS de guardar:', savedHospitalizacion);
    console.log('--- FIN DEL PROCESO CREATE ---');

    return { message: 'Se añadió una nueva hospitalización y la cama fue marcada como ocupada.' };
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

  async findAlta() {
    const listAlta = await this.hospitalizacionRepo.find({
      where: { estado: Estado_Hospitalizacion.ALTA },
      relations: ['paciente', 'paciente.historia', 'medico'],
      order: { fecha_salida: 'DESC' }
    });

    if (listAlta.length === 0) {
      return [];
    }

    const informes = listAlta.map(hospit => {
      return {
        id: hospit.id,
        paciente: hospit.paciente,
        diagnosticoIngreso: hospit.diagnostico_ingreso,
        medicoTratante: `${hospit.medico.nombres} ${hospit.medico.apellidos}`,
        fechaIngreso: hospit.fecha_ingreso,
        cama: hospit.cama ? hospit.cama.cama : 'N/A',
        area: hospit.area_destino,
        estado: hospit.estado,
        diagnostico_alta: hospit.diagnostico_alta,
        diagnostico_secundario: hospit.diagnostico_secundario,
        tratamiento_realizado: hospit.tratamiento_realizado,
        recomendaciones_hogar: hospit.recomendaciones_hogar,
        pronostico: hospit.pronostico,
        fecha_salida: hospit.fecha_salida
      };
    });

    return informes;
  }

  async findAllActive() {
    const listHospitalizacion = await this.hospitalizacionRepo.find({
      where: { estado: Estado_Hospitalizacion.HOSPITALIZADO },
      relations: ['cama', 'medico', 'paciente', 'paciente.historia'], // Cargamos todo lo que podamos
    });

    if (listHospitalizacion.length === 0) {
      return [];
    }

    const hospitalizacionesValidas = listHospitalizacion.filter(h => h.paciente);

    const hospitalizacionesDTO = hospitalizacionesValidas.map(hospit => {
      return {
        id: hospit.id,
        paciente: hospit.paciente,
        diagnosticoIngreso: hospit.diagnostico_ingreso,
        medicoTratante: hospit.medico ? `${hospit.medico.nombres} ${hospit.medico.apellidos}` : 'No Asignado',
        fechaIngreso: hospit.fecha_ingreso,
        cama: hospit.cama ? hospit.cama.cama : 'N/A',
        area: hospit.area_destino,
        estado: hospit.estado,
          diagnostico_alta: hospit.diagnostico_alta,
          diagnostico_secundario: hospit.diagnostico_secundario,
          tratamiento_realizado: hospit.tratamiento_realizado,
          recomendaciones_hogar: hospit.recomendaciones_hogar,
          pronostico: hospit.pronostico,
          fecha_salida: hospit.fecha_salida
        };
      },
    );
    return hospitalizacionesDTO;
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

  async changeState(id: number, bodyAlta: darAltaDto) {
    console.log(`--- INICIO DEL PROCESO CHANGE_STATE para ID: ${id} ---`);
    const hospitalizacion = await this.hospitalizacionRepo.findOne({
      where: { id: id },
      relations: ['paciente', 'cama'],
    });

    console.log(`--- INICIO DEL PROCESO CHANGE_STATE para ID: ${id} ---`);

    if (!hospitalizacion) {
      throw new NotFoundException(`No se encontró la hospitalización con el id: ${id}`);
    }

    if (hospitalizacion.estado === Estado_Hospitalizacion.ALTA) {
      throw new BadRequestException("Esta hospitalizacion ya está dada de alta");
    }

    if (hospitalizacion.cama) {
      console.log('✅ Cama encontrada. Actualizando estado.');
      const cama = hospitalizacion.cama;
      cama.estado = ESTADO_CAMA.DISPONIBLE;
      await this.camaRepo.save(cama);
    } else {
      console.log('❌ ¡FALLO! No se encontró una cama asociada en el objeto hospitalizacion.');
    }

    hospitalizacion.estado = Estado_Hospitalizacion.ALTA;
    hospitalizacion.fecha_salida = new Date();
    Object.assign(hospitalizacion, bodyAlta);
    await this.hospitalizacionRepo.save(hospitalizacion);

    const nombrePaciente = hospitalizacion.paciente ? `${hospitalizacion.paciente.nombres} ${hospitalizacion.paciente.apellidos}` : `con id ${id}`;
    return { message: `Se dio de alta al paciente ${nombrePaciente} y la cama ha sido liberada.` };
  }

  
}
