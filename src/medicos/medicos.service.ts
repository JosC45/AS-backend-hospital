import { BadRequestException, Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';
import { UsuarioService } from 'src/usuario/usuario.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Medico } from './entities/medico.entity';
import { Repository } from 'typeorm';
import { ROLES_USUARIO } from 'src/usuario/entities/usuario.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MedicosService  implements OnModuleInit{
  constructor(
    @Inject('TCP_CLIENT') private client:ClientProxy,
    private readonly usuarioService:UsuarioService,

    @InjectRepository(Medico)
    private medicoRepo:Repository<Medico>
  ){
  }

  async onModuleInit() {
    console.log('🚀 MedicosService iniciado, contando médicos...');
    await this.countMedicos();
  }

  async create(createMedicoDto: CreateMedicoDto) {
    const {nombres,apellidos,tipo,...bodyUsuario}=createMedicoDto
    
    const {id}=await this.usuarioService.createUserByRol({username:bodyUsuario.correo,password:bodyUsuario.dni,rol:ROLES_USUARIO.MEDICO})

    const newMedico=this.medicoRepo.create({...createMedicoDto,usuario:{id}})

    await this.medicoRepo.save(newMedico)
    await this.countMedicos() 
    return 'El medico fue creado satisfactoriamente con su usuario';
  }

  async findAll() {
    const listMedicos=await this.medicoRepo.find()
    if(listMedicos.length===0) throw new NotFoundException("No se encontro medicos")
    return listMedicos;
  }

  async countMedicos(){
    const [,numeroMedicos]=await this.medicoRepo.findAndCount()
    this.client.emit('cantidad_medicos',{
      total: numeroMedicos,
      source: 'medicos_service',
      updatedAt: new Date(),
    })
    console.log('🔴 Emitiendo cantidad_pacientes:', numeroMedicos);
  }
  async findOne(id: number) {
    try{
      const oneMedico=await this.medicoRepo.findOneByOrFail({id})
      return oneMedico;
    }catch(err){
      throw new NotFoundException("No se encontro el medico con ese id")
    }
  }

  async update(id: number, updateMedicoDto: UpdateMedicoDto) {
    const updatedMedico=await this.medicoRepo.update(id,updateMedicoDto)
    if(updatedMedico.affected===0)throw new BadRequestException("No se modifico ningun medico")
    return `Se actualizo el medico con id: ${id}`;
  }

  async remove(id: number) {
    const deleted=await this.medicoRepo.delete(id)
    if(deleted.affected===0)throw new BadRequestException(`No se elimino el medico con id ${id}`)
    return `Se elimino el medico con id :${id} `;
  }
}
