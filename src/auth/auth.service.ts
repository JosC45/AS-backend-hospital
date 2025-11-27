import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BodyAuthDto } from './dto/body-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
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

  async changePassword(id_user:number,new_password:string){
    const hashedPassword=await bcrypt.hash(new_password,10)

    const user=await this.usuarioRepo.findOneByOrFail({id:id_user})

    user.password=hashedPassword

    await this.usuarioRepo.save(user)

    return {message:"Its already change"}

  }

  findAll() {
    return `This action returns all auth`;
  }

  async findOne(id: number) {
    
    return `This action returns a #${id} auth`;
  }
  async logout() {
    return { message: 'Logout successful' };
  }
  
  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
