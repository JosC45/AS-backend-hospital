import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}
  
  @Post('add')
  create(@Body() createPersonalDto: CreatePersonalDto) {
    return this.personalService.create(createPersonalDto);
  }

  @Get()
  findAll() {
    return this.personalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonalDto: UpdatePersonalDto) {
    return this.personalService.update(+id, updatePersonalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personalService.remove(+id);
  }
}
