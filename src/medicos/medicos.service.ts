import { BadRequestException, Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';
import { UsuarioService } from 'src/usuario/usuario.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Medico } from './entities/medico.entity';
import { Repository } from 'typeorm';
import { ESTADO_USUARIO, ROLES_USUARIO } from 'src/usuario/entities/usuario.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MedicosService{
  constructor(
    
    private readonly usuarioService:UsuarioService,

    @InjectRepository(Medico)
    private medicoRepo:Repository<Medico>
  ){
  }

  

  async create(createMedicoDto: CreateMedicoDto) {
    const { usuario, ...medicoProfileData } = createMedicoDto;

    const newUser = await this.usuarioService.createUserByRol({
      username: usuario.username,
      password: usuario.password,
      rol: usuario.rol,
      estado: usuario.estado,
      keyword:usuario.keyword
    });

    const newMedico = this.medicoRepo.create({
      ...medicoProfileData,
      usuario: newUser
    });

    await this.medicoRepo.save(newMedico);
    await this.countMedicos();
    return 'El medico fue creado satisfactoriamente con su usuario';
  }

  async findAll() {
    const listMedicos=await this.medicoRepo.find()
    if(listMedicos.length===0) throw new NotFoundException("No se encontro medicos")
    return listMedicos;
  }

  async countMedicos(){
    const [,numeroMedicos]=await this.medicoRepo.findAndCount()
    //console.log('🔴 Emitiendo cantidad_pacientes:', numeroMedicos);
    return numeroMedicos
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
    const {usuario,...updateMedico}=updateMedicoDto
    const updatedMedico=await this.medicoRepo.update(id,{...updateMedico})
    if(updatedMedico.affected===0)throw new BadRequestException("No se modifico ningun medico")
    return `Se actualizo el medico con id: ${id}`;
  }

  async remove(id: number) {
    const deleted=await this.medicoRepo.delete(id)
    if(deleted.affected===0)throw new BadRequestException(`No se elimino el medico con id ${id}`)
    return `Se elimino el medico con id :${id} `;
  }
}
