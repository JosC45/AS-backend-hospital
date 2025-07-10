import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TriagesService } from './triages.service';
import { CreateTriageDto } from './dto/create-triage.dto';
import { UpdateTriageDto } from './dto/update-triage.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('triages')
export class TriagesController {
  constructor(private readonly triagesService: TriagesService) {}

  // @UseGuards(JwtAuthGuard,RolesGuard)
  // @Roles('admin')
  @Post('add')
  create(@Body() createTriageDto: CreateTriageDto) {
    return this.triagesService.create(createTriageDto);
  }

  @Get('all')
  findAll() {
    return this.triagesService.findAll();
  }

  @Get('listByHistoria/:id')
  findByHistoria(@Param('id') id: string){
    return this.triagesService.listByHistoria(+id)
  }

  @Get('list/:id')
  findOne(@Param('id') id: string) {
    return this.triagesService.findOne(+id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateTriageDto: UpdateTriageDto) {
    return this.triagesService.update(+id, updateTriageDto);
  }

  @Patch('finished/:id')
  finish(@Param('id') id:string){
    return this.triagesService.finish(+id)
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.triagesService.remove(+id);
  }
}
