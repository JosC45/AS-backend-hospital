import { forwardRef, Module } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';
import { Hospitalizacion } from 'src/hospitalizacion/entities/hospitalizacion.entity';
import { Orden } from 'src/ordenes/entities/orden.entity';
import { Historia } from 'src/historias/entities/historia.entity';
import { HistoriasModule } from 'src/historias/historias.module';
import { HospitalizacionModule } from 'src/hospitalizacion/hospitalizacion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Paciente,
      // Hospitalizacion, 
      Orden,
      Historia
    ]),
    forwardRef(() => HospitalizacionModule),
    HistoriasModule,
    // RedisClientModule,
  ],
  controllers: [PacientesController],
  providers: [PacientesService],
  exports: [PacientesService]
})
export class PacientesModule { }