import { Module } from '@nestjs/common';
import { OrdenesService } from './ordenes.service';
import { OrdenesController } from './ordenes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orden } from './entities/orden.entity';
import { Medicamento } from './entities/medicamentos.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Orden,Medicamento,Paciente])],
  controllers: [OrdenesController],
  providers: [OrdenesService],
})
export class OrdenesModule {}
