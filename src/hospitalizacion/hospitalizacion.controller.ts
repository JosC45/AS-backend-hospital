import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HospitalizacionService } from './hospitalizacion.service';
import { CreateHospitalizacionDto } from './dto/create-hospitalizacion.dto';
import { UpdateHospitalizacionDto } from './dto/update-hospitalizacion.dto';
import { darAltaDto } from './dto/dar-alta.dto';
import { AREA_DESTINO } from './entities/hospitalizacion.entity';

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

  @Get('alta')
  listAlta(){
    return this.hospitalizacionService.findAlta()
  }

  @Get('area/:area')
  listByArea(@Param('area') area:AREA_DESTINO){
    return this.hospitalizacionService.findByArea(area)
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
  dar_alta(@Param('id') id:number,@Body() body:darAltaDto){
    return this.hospitalizacionService.changeState(+id,body)
  }

  @Get('camas/estadisticas')
  getCamasPorEstado() {
    return this.hospitalizacionService.getCantidadCamasPorEstado();
  }
}
