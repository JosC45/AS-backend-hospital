import { Module } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';
import { Historia } from 'src/historias/entities/historia.entity';
import { RedisClientModule } from 'src/redis-client.module';
import { HistoriasModule } from 'src/historias/historias.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Paciente, Historia]),
    RedisClientModule,
    HistoriasModule
  ],
  controllers: [PacientesController],
  providers: [PacientesService],
  exports: [PacientesService]
})
export class PacientesModule {}