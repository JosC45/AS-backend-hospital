import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTriageDto } from './dto/create-triage.dto';
import { UpdateTriageDto } from './dto/update-triage.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Triage } from './entities/triage.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TriagesService {
  constructor(
    @InjectRepository(Triage)
    private triageRepo:Repository<Triage>
  ){}
  async create(createTriageDto: CreateTriageDto) {
    const { id_historia, ...triageData } = createTriageDto;
    const newTriage=this.triageRepo.create({...triageData,historia:{id:createTriageDto.id_historia},fecha_creacion:new Date()})
    await this.triageRepo.save(newTriage)
    return 'Se añadio correctamente el nuevo triage';
  }

  async findAll() {
    const listTriages=await this.triageRepo
    .createQueryBuilder('tri')
    .innerJoin('tri.historia','hist')
    .innerJoinAndSelect('hist.paciente','pac')
    .select(['pac.nombres AS nombres','pac.apellidos AS apellidos','tri.motivo AS motivo','tri.prioridad AS prioridad','tri.fecha_creacion AS fecha_creacion',
      'tri.presion_arterial AS presion_arterial','tri.latidos_pm AS latidos_pm','tri.temperatura AS temperatura'])
    .where('tri.estado=:estado',{estado:'proceso'})
    .getRawMany()

    if(listTriages.length===0)throw new NotFoundException("No se encontro triages")
    return listTriages;
  }

  async listOne(id:number){
    const triage=await this.triageRepo.findOne({where:{id},relations:['historia']})
    if(!triage)throw new NotFoundException("No se encontro la consulta con ese id")
    return triage
  }

  async findOne(id: number) {
    const oneTriage=await this.triageRepo
    .createQueryBuilder('tri')
    .innerJoin('tri.historia','hist')
    .innerJoinAndSelect('hist.paciente','pac')
    .select(['pac.nombres AS nombres','pac.apellidos AS apellidos','tri.motivo AS motivo','tri.prioridad AS prioridad','tri.fecha_creacion AS fecha_creacion',
      'tri.presion_arterial AS presion_arterial','tri.latidos_pm AS latidos_pm','tri.temperatura AS temperatura'])
    .where('tri.id=:id',{id})
    .getRawOne()

    return oneTriage;
  }

  async listByHistoria(id:number){
    const listTriages=await this.triageRepo
    .createQueryBuilder('tri')
    .innerJoin('tri.historia','hist')
    .innerJoinAndSelect('hist.paciente','pac')
    .select(['pac.nombres AS nombres','pac.apellidos AS apellidos','tri.motivo AS motivo','tri.prioridad AS prioridad','tri.fecha_creacion AS fecha_creacion',
      'tri.presion_arterial AS presion_arterial','tri.latidos_pm AS latidos_pm','tri.temperatura AS temperatura'])
    .where('hist.id=:id',{id})
    .getRawMany()

    if(listTriages.length===0)throw new NotFoundException("No se encontro triages")
    return listTriages;
  }

  async update(id: number, updateTriageDto: UpdateTriageDto) {
    const triage = await this.triageRepo.findOne({ where: { id } });
    if (!triage) throw new NotFoundException(`Triage con id ${id} no encontrado`);

    if (updateTriageDto.id_historia) triage.historia = { id: updateTriageDto.id_historia } as any;
    
    Object.assign(triage, updateTriageDto);
    await this.triageRepo.save(triage);

    return `Se actualizó correctamente el triage con id: #${id}`;
  }
  async finish(id:number){
    const finished=await this.triageRepo.update({id},{estado:'finalizado'})
    if(finished.affected===0) throw new BadRequestException("no se pudo finzliar el triaje fijese el id")
    return `Se finalizo el triage con id ${id}`
  }

  async remove(id: number) {
    const deletedTriage=await this.triageRepo.delete({id})
    if(deletedTriage.affected===0)throw new NotFoundException("No se elimino ningun registro")
    return `See eleimino el triage con id #${id}`;
  }
  
  async getCantidadTriajesUltimos7Dias() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // inicio del día de hoy
  
    const hace6Dias = new Date(hoy);
    hace6Dias.setDate(hoy.getDate() - 6); // 6 días atrás
  
    // Obtener triajes desde hace 6 días hasta hoy
    const registros = await this.triageRepo
      .createQueryBuilder('triage')
      .select("DATE(triage.fecha_creacion)", "fecha")
      .addSelect("COUNT(*)", "cantidad")
      .where("triage.fecha_creacion >= :desde", { desde: hace6Dias })
      .groupBy("DATE(triage.fecha_creacion)")
      .orderBy("fecha", "ASC")
      .getRawMany();
  
    // Crear estructura fija para los 7 días
    const resultados: { fecha: string; cantidad: number }[] = [];
  
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(hace6Dias);
      fecha.setDate(hace6Dias.getDate() + i);
  
      const yyyy = fecha.getFullYear();
      const mm = String(fecha.getMonth() + 1).padStart(2, '0');
      const dd = String(fecha.getDate()).padStart(2, '0');
      const fechaStr = `${yyyy}-${mm}-${dd}`;
  
      const encontrado = registros.find(r => {
        const rFecha = new Date(r.fecha);
        const rFechaStr = `${rFecha.getFullYear()}-${String(rFecha.getMonth() + 1).padStart(2, '0')}-${String(rFecha.getDate()).padStart(2, '0')}`;
        return rFechaStr === fechaStr;
      });
  
      resultados.push({
        fecha: fechaStr,
        cantidad: encontrado ? parseInt(encontrado.cantidad, 10) : 0,
      });
    }
  
    return resultados;
  }
}
