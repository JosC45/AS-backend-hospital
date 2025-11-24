import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import * as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm';
import { Keyword } from './entities/keyword.entity';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class KeywordService {
  constructor(
    @InjectRepository(Keyword)
    private readonly keyword_repo:Repository<Keyword>
  ){}

  async create(createKeywordDto: CreateKeywordDto) {
    return 'This action adds a new keyword';
  }

  async assign_keyword(createKeywordDto:CreateKeywordDto){
    const { keyword ,usuario}=createKeywordDto;
    const hashedKeyword=await bcrypt.hash(String(keyword),10);
    const newKeyword=this.keyword_repo.create({
      palabra_clave:hashedKeyword,
      usuario
    })

    return this.keyword_repo.save(newKeyword)
  }

  async validate_keyword(palabra_clave:string,usuario:Usuario){
    const palabra=await this.keyword_repo.findOneBy({usuario})
    if (!palabra || !(await bcrypt.compare(palabra_clave, palabra.palabra_clave))) {
          throw new UnauthorizedException('Invalid credentials');
        }
        return true;
  }

  async edit_keyword(id_keyword:number,keyword:string){
    const hashedKeyword=await bcrypt.hash(String(keyword),10);
    const updatedKeyword=await this.keyword_repo.update({id:id_keyword},{palabra_clave:hashedKeyword})
    if(updatedKeyword.affected === 0) throw new BadRequestException("No se actualizo ningun antecedente");

    return updatedKeyword
    
  }

  
  findAll() {
    return `This action returns all keyword`;
  }

  findOne(id: number) {
    return `This action returns a #${id} keyword`;
  }

  update(id: number, updateKeywordDto: UpdateKeywordDto) {
    return `This action updates a #${id} keyword`;
  }

  remove(id: number) {
    return `This action removes a #${id} keyword`;
  }
}
