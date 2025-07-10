import { Module } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';
import { HistoriasModule } from 'src/historias/historias.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisClientModule } from 'src/redis-client.module';

@Module({
  imports:[TypeOrmModule.forFeature([Paciente]),HistoriasModule,RedisClientModule],
  controllers: [PacientesController],
  providers: [PacientesService],
  exports:[PacientesService]
})
export class PacientesModule {}
