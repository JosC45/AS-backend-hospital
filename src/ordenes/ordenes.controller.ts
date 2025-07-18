import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdenesService } from './ordenes.service';
import { CreateOrdeneDto } from './dto/create-ordene.dto';
import { UpdateOrdeneDto } from './dto/update-ordene.dto';

@Controller('ordenes')
export class OrdenesController {
  constructor(private readonly ordenesService: OrdenesService) {}

  @Post('add')
  create(@Body() createOrdeneDto: CreateOrdeneDto) {
    return this.ordenesService.create(createOrdeneDto);
  }

  @Get('all')
  findAll() {
    return this.ordenesService.findAll();
  }

  @Get('list/:id')
  findOne(@Param('id') id: string) {
    return this.ordenesService.findOne(+id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateOrdeneDto: UpdateOrdeneDto) {
    return this.ordenesService.update(+id, updateOrdeneDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.ordenesService.remove(+id);
  }
}
