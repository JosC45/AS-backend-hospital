import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ESTADO_USUARIO, Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo:Repository<Usuario>

  ){}
  async create(createUsuarioDto: CreateUsuarioDto){
    const newUser=this.usuarioRepo.create(createUsuarioDto)
    await this.usuarioRepo.save(newUser)

    return `Se creo el usuario con el rol ${createUsuarioDto.rol}`;
  }

  async createUserByRol(body:CreateUsuarioDto){
    try {
        const exist = await this.usuarioRepo.findOneBy({ username: body.username });
        if (exist) throw new ConflictException("Ese usuario ya existe");

        const hashedPassword = await bcrypt.hash(body.password, 10);

        const newUsuario = this.usuarioRepo.create({
            username: body.username,
            password: hashedPassword,
            rol: body.rol,
            estado: ESTADO_USUARIO.ACTIVO
        });

        await this.usuarioRepo.save(newUsuario);
        return newUsuario;

    } catch (err) {

        if (err instanceof ConflictException) {
            throw err;
        }

        throw new InternalServerErrorException("Error al crear el usuario");
    }
  }

  findAll() {
    return `This action returns all usuario`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }

}