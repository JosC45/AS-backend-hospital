import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TriagesService } from './triages.service';
import { CreateTriageDto } from './dto/create-triage.dto';
import { UpdateTriageDto } from './dto/update-triage.dto';

@Controller('triages')
export class TriagesController {
  constructor(private readonly triagesService: TriagesService) {}

  @Post('add')
  create(@Body() createTriageDto: CreateTriageDto) {
    return this.triagesService.create(createTriageDto);
  }

  @Get()
  findAll() {
    return this.triagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.triagesService.findOne(+id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateTriageDto: UpdateTriageDto) {
    return this.triagesService.update(+id, updateTriageDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.triagesService.remove(+id);
  }
}
