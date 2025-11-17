import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BodyAuthDto } from './dto/body-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo:Repository<Usuario>,

    private jwtService:JwtService
  ){}
  async validateUser(username:string,password:string) {
    const user = await this.usuarioRepo.findOneBy({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(user:Usuario){
    const payload={sub:user.id, username:user.username, role:user.rol}
    return{
      access_token:this.jwtService.sign(payload)
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  
  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
