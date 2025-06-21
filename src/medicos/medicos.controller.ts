import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MedicosService } from './medicos.service';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';

@Controller('medicos')
export class MedicosController {
  constructor(private readonly medicosService: MedicosService) {}

  @Post('add')
  create(@Body() createMedicoDto: CreateMedicoDto) {
    return this.medicosService.create(createMedicoDto);
  }

  @Get('all')
  findAll() {
    return this.medicosService.findAll();
  }

  @Get('list/:id')
  findOne(@Param('id') id: string) {
    return this.medicosService.findOne(+id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateMedicoDto: UpdateMedicoDto) {
    return this.medicosService.update(+id, updateMedicoDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.medicosService.remove(+id);
  }
}
