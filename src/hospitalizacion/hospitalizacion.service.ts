import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHospitalizacionDto } from './dto/create-hospitalizacion.dto';
import { UpdateHospitalizacionDto } from './dto/update-hospitalizacion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AREA_DESTINO, Estado_Hospitalizacion, Hospitalizacion } from './entities/hospitalizacion.entity';
import { darAltaDto } from './dto/dar-alta.dto';

@Injectable()
export class HospitalizacionService {
  constructor(
    @InjectRepository(Hospitalizacion)
    private hospitalizacionRepo:Repository<Hospitalizacion>
  ){}
  async create(createHospitalizacionDto: CreateHospitalizacionDto) {
    const {id_medico,id_cama,...bodyHospitalizacion}=createHospitalizacionDto
    const newHospitalizacion=this.hospitalizacionRepo.create({...bodyHospitalizacion,medico:{id:id_medico},cama:{id:id_cama}})
    await this.hospitalizacionRepo.save(newHospitalizacion)
    return 'Se añadio una nueva hospitalizacion';
  }

  async findAll() {
    const listHospitalizaciones=await this.hospitalizacionRepo.find()
    if(listHospitalizaciones.length===0)throw new NotFoundException("No se encontraron hospitalizaciones")
    
    return listHospitalizaciones;
  }
  
  async findByArea(area_destino:AREA_DESTINO){
    const listHospitalizacion=await this.hospitalizacionRepo.find({where:{area_destino},relations:['cama','medico'],select:['diagnostico_ingreso','fecha_ingreso','area_destino','cama','intervencion','id_intervencion']})
    const hospitalizaciones=Promise.all(listHospitalizacion.map(async(hospit)=>{
      
    }))
  }

  async findOne(id: number) {
    try{
      const oneHospitalizacion=await this.hospitalizacionRepo.findOneByOrFail({id})
      return oneHospitalizacion
    }catch(err){
      throw new NotFoundException(`No se encontro hospitalizaciones con el id: ${id}`)
    }
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
