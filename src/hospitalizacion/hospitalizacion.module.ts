import { Module } from '@nestjs/common';
import { HospitalizacionService } from './hospitalizacion.service';
import { HospitalizacionController } from './hospitalizacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospitalizacion } from './entities/hospitalizacion.entity';
import { TriagesModule } from 'src/triages/triages.module';
import { ConsultasModule } from 'src/consultas/consultas.module';
import { PacientesModule } from 'src/pacientes/pacientes.module';
import { Camas } from './entities/camas.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Hospitalizacion,Camas]),TriagesModule,ConsultasModule,PacientesModule],
  controllers: [HospitalizacionController],
  providers: [HospitalizacionService],
})
export class HospitalizacionModule {}
