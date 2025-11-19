import { Module, forwardRef } from '@nestjs/common';
import { HospitalizacionService } from './hospitalizacion.service';
import { HospitalizacionController } from './hospitalizacion.controller';
import { PacientesModule } from 'src/pacientes/pacientes.module'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospitalizacion } from './entities/hospitalizacion.entity';
import { Camas } from './entities/camas.entity';
import { TriagesModule } from 'src/triages/triages.module'; 
import { ConsultasModule } from 'src/consultas/consultas.module';
import { Consulta } from 'src/consultas/entities/consulta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hospitalizacion, Camas, Consulta]),
    forwardRef(() => PacientesModule),
    TriagesModule,
    ConsultasModule,
  ],
  controllers: [HospitalizacionController],
  providers: [HospitalizacionService],
  exports: [HospitalizacionService, TypeOrmModule]
})
export class HospitalizacionModule { }