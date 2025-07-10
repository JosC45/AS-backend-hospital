import { Module } from '@nestjs/common';
import { HospitalizacionService } from './hospitalizacion.service';
import { HospitalizacionController } from './hospitalizacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospitalizacion } from './entities/hospitalizacion.entity';
import { TriagesModule } from 'src/triages/triages.module';
import { ConsultasModule } from 'src/consultas/consultas.module';
import { PacientesModule } from 'src/pacientes/pacientes.module';

@Module({
  imports:[TypeOrmModule.forFeature([Hospitalizacion]),TriagesModule,ConsultasModule,PacientesModule],
  controllers: [HospitalizacionController],
  providers: [HospitalizacionService],
})
export class HospitalizacionModule {}
