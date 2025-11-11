import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) { }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const { password, ...userData } = createUsuarioDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.usuarioRepo.create({
      ...userData,
      password: hashedPassword,
    });
    return this.usuarioRepo.save(newUser);
  }

  async createUserByRol(createUsuarioDto: CreateUsuarioDto) {
    const { password, ...userData } = createUsuarioDto;
    const hashedPassword = await bcrypt.hash(String(password), 10);
    const newUser = this.usuarioRepo.create({
      ...userData,
      password: hashedPassword,
    });
    return this.usuarioRepo.save(newUser);
  }

  findAll() {
    return this.usuarioRepo.find();
  }

  async findOne(id: number) {
    const user = await this.usuarioRepo.findOne({
      where: { id },
      relations: ['medico', 'admin', 'personal'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID #${id} no encontrado`);
    }

    const { password, ...result } = user;
    return result;
  }

  async findOneByUsername(username: string) {
    return this.usuarioRepo.findOneBy({ username });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    if (updateUsuarioDto.password) {
      updateUsuarioDto.password = await bcrypt.hash(updateUsuarioDto.password, 10);
    }
    await this.usuarioRepo.update(id, updateUsuarioDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.usuarioRepo.delete(id);
    return { message: `Usuario con ID #${id} eliminado.` };
  }
}