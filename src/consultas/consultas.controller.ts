import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConsultasService } from './consultas.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import { throws } from 'assert';

@Controller('consultas')
export class ConsultasController {
  constructor(private readonly consultasService: ConsultasService) {}
  
  @Post('add')
  create(@Body() createConsultaDto: CreateConsultaDto) {
    return this.consultasService.create(createConsultaDto);
  }
  
  @Get('all')
  findAll() {
    return this.consultasService.findAll();
  }
  @Get('hoy')
  getConsultasDeHoy() {
    return this.consultasService.findConsultasDeHoy();
  }
  
  @Get('listByHistoria/:id')
  findByHistoria(@Param('id') id:string){
    return this.consultasService.listByHistoria(+id)
  }
  
  @Patch("finish/:id")
  finally(@Param('id') id:string){
    return this.consultasService.finish(+id)
  }
  @Get('list/:id')
  findOne(@Param('id') id: string) {
    return this.consultasService.findOne(+id);
  }
  
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateConsultaDto: UpdateConsultaDto) {
    return this.consultasService.update(+id, updateConsultaDto);
  }
  
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.consultasService.remove(+id);
  }
}
