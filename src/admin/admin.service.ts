import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UsuarioService } from 'src/usuario/usuario.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    private readonly usuarioService:UsuarioService,

    @InjectRepository(Admin)
    private adminRepo:Repository<Admin>
  ){}
  async create(createAdminDto: CreateAdminDto) {
    const { usuario, ...adminProfileData } = createAdminDto;

    const newUser = await this.usuarioService.createUserByRol({
      username: usuario.username,
      password: usuario.password,
      rol: usuario.rol,
      estado: usuario.estado
    });

    const newAdmin = this.adminRepo.create({
      ...adminProfileData,
      usuario: newUser
    });

    await this.adminRepo.save(newAdmin);

    return 'El admin fue creado satisfactoriamente con su usuario';
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
