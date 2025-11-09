import { Module } from '@nestjs/common';
import { HospitalizacionService } from './hospitalizacion.service';
import { HospitalizacionController } from './hospitalizacion.controller';
import { PacientesModule } from 'src/pacientes/pacientes.module'; // <-- 1. IMPORTA PACIENTESMODULE
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospitalizacion } from './entities/hospitalizacion.entity';
import { Camas } from './entities/camas.entity';
// Probablemente necesites importar otros módulos también, como Triages y Consultas
import { TriagesModule } from 'src/triages/triages.module'; 
import { ConsultasModule } from 'src/consultas/consultas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hospitalizacion, Camas]),
    PacientesModule,
    TriagesModule,
    ConsultasModule,
  ],
  controllers: [HospitalizacionController],
  providers: [HospitalizacionService],
})
export class HospitalizacionModule {}