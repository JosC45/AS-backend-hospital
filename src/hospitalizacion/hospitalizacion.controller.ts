import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HospitalizacionService } from './hospitalizacion.service';
import { CreateHospitalizacionDto } from './dto/create-hospitalizacion.dto';
import { UpdateHospitalizacionDto } from './dto/update-hospitalizacion.dto';

@Controller('hospitalizacion')
export class HospitalizacionController {
  constructor(private readonly hospitalizacionService: HospitalizacionService) {}

  @Post('add')
  create(@Body() createHospitalizacionDto: CreateHospitalizacionDto) {
    return this.hospitalizacionService.create(createHospitalizacionDto);
  }

  @Get('all')
  findAll() {
    return this.hospitalizacionService.findAll();
  }

  @Get('list/:id')
  findOne(@Param('id') id: string) {
    return this.hospitalizacionService.findOne(+id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateHospitalizacionDto: UpdateHospitalizacionDto) {
    return this.hospitalizacionService.update(+id, updateHospitalizacionDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.hospitalizacionService.remove(+id);
  }

  @Patch('darAlta/:id')
  dar_alta(@Param('id') id:number){
    return this.hospitalizacionService.changeState(+id)
  }
}
