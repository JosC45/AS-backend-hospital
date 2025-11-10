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

  // ... (métodos create, createUserByRol, findAll no cambian) ...

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

  // --- MÉTODO CORREGIDO ---
  async findOne(id: number) {
    // Cambiamos findOneBy por findOne para poder usar la opción 'relations'
    const user = await this.usuarioRepo.findOne({
      where: { id },
      // Le decimos a TypeORM que cargue también los datos de estas entidades relacionadas
      relations: ['medico', 'admin', 'personal'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID #${id} no encontrado`);
    }

    // Devolvemos el usuario completo (con sus relaciones) pero sin la contraseña
    const { password, ...result } = user;
    return result;
  }

  async findOneByUsername(username: string) {
    // Opcional: si también necesitas los perfiles al hacer login,
    // deberías aplicar la misma lógica de 'relations' aquí.
    return this.usuarioRepo.findOneBy({ username });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    if (updateUsuarioDto.password) {
      updateUsuarioDto.password = await bcrypt.hash(updateUsuarioDto.password, 10);
    }
    await this.usuarioRepo.update(id, updateUsuarioDto);
    return this.findOne(id); // findOne ahora devolverá el perfil completo
  }

  async remove(id: number) {
    const user = await this.findOne(id); // Primero busca para asegurar que existe
    await this.usuarioRepo.delete(id);
    return { message: `Usuario con ID #${id} eliminado.` };
  }
}