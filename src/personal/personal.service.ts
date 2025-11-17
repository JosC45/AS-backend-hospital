import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Personal } from './entities/personal.entity';
import { Repository } from 'typeorm';
import { UsuarioService } from '../usuario/usuario.service';
import { ROLES_USUARIO } from '../usuario/entities/usuario.entity';

@Injectable()
export class PersonalService {
  constructor(
    private readonly usuarioService:UsuarioService,

    @InjectRepository(Personal)
    private personalRepo:Repository<Personal>
  ){}

  async create(createPersonalDto: CreatePersonalDto) {
    const {nombres,apellidos,tipo,...bodyUsuario}=createPersonalDto

    const {id}=await this.usuarioService.createUserByRol({username:bodyUsuario.correo,password:bodyUsuario.dni,rol:ROLES_USUARIO.PERSONAL})

    const newPersonal=this.personalRepo.create({...createPersonalDto,usuario:{id}})

    await this.personalRepo.save(newPersonal)

    return 'El personal fue creado satisfactoriamente con su usuario';
  }

  async findAll() {
    const listPersonal=await this.personalRepo.find()
    if(listPersonal.length===0)throw new NotFoundException("No se encontro personal")
    return listPersonal;
  }

  async findOne(id: number) {
    try{
      const onePersonal=await this.personalRepo.findOneByOrFail({id})
      return onePersonal;
    }catch(err){
      throw new NotFoundException("No se encontro personal con ese id")
    }
  }

  async update(id: number, updatePersonalDto: UpdatePersonalDto) {
    const updatedPersonal=await this.personalRepo.update(id,updatePersonalDto)
    if(updatedPersonal.affected===0)throw new BadRequestException("No se actualizo ningun registro")
    return `Se actualizo el registro con id ${id} `;
  }

  async remove(id: number) {
    const deleted=await this.personalRepo.delete(id)
    if(deleted.affected===0)throw new NotFoundException(`No se elimino el persoonal con id ${id}`)
    return `Se elimino el personal con id: ${id} `;
  }
}
