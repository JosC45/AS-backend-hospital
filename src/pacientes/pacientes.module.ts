import { Module } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';
import { HistoriasModule } from 'src/historias/historias.module';

@Module({
  imports:[TypeOrmModule.forFeature([Paciente]),HistoriasModule],
  controllers: [PacientesController],
  providers: [PacientesService],
})
export class PacientesModule {}
