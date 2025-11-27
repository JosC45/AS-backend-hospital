import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { KeywordService } from 'src/keyword/keyword.service';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly keywordService:KeywordService,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,

  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const { password, keyword,...userData } = createUsuarioDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.usuarioRepo.create({
      ...userData,
      password: hashedPassword,
    });

    const palabra_clave=await this.keywordService.assign_keyword({keyword,usuario:newUser})

    newUser.keyword=palabra_clave
    return this.usuarioRepo.save(newUser);
  }

  async createUserByRol(createUsuarioDto: CreateUsuarioDto) {
    const { password, keyword,...userData } = createUsuarioDto;
    const hashedPassword = await bcrypt.hash(String(password), 10);
    const newUser = this.usuarioRepo.create({
      ...userData,
      password: hashedPassword,
    });
    const palabra_clave=await this.keywordService.assign_keyword({keyword,usuario:newUser})

    newUser.keyword=palabra_clave
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
    const { keyword, ...updateUsuario}=updateUsuarioDto
    if (updateUsuario.password) {
      updateUsuario.password = await bcrypt.hash(updateUsuarioDto.password, 10);
    }
    await this.usuarioRepo.update(id, {...updateUsuario});
    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.usuarioRepo.delete(id);
    return { message: `Usuario con ID #${id} eliminado.` };
  }

  async loginWithKeyword(username:string,keyword:string){
    const user=await this.usuarioRepo.findOneByOrFail({username})

    const validate_keyword=await this.keywordService.validate_keyword(keyword,user)

    return {
      "Sucessfull": validate_keyword,
      "id_user": user.id
    }
  }
}