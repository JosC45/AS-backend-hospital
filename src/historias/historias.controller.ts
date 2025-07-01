import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistoriasService } from './historias.service';
import { CreateHistoriaDto } from './dto/create-historia.dto';
import { UpdateHistoriaDto } from './dto/update-historia.dto';

@Controller('historias')
export class HistoriasController {
  constructor(private readonly historiasService: HistoriasService) {}

  // @Post('add')
  // create(@Body() createHistoriaDto: CreateHistoriaDto) {
  //   return this.historiasService.create(createHistoriaDto);
  // }

  @Get('all')
  findAll() {
    return this.historiasService.findAll();
  }

  @Get('list/:id')
  findOne(@Param('id') id: string) {
    return this.historiasService.findOne(+id);
  }

  // @Patch('update/:id')
  // update(@Param('id') id: string, @Body() updateHistoriaDto: UpdateHistoriaDto) {
  //   return this.historiasService.update(+id, updateHistoriaDto);
  // }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.historiasService.remove(+id);
  }
}
