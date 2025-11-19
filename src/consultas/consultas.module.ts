import { Module } from '@nestjs/common';
import { ConsultasService } from './consultas.service';
import { ConsultasController } from './consultas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consulta } from './entities/consulta.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisClientModule } from 'src/redis-client.module';
import { Cita } from 'src/citas/entities/cita.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Consulta, Cita]),RedisClientModule],
  controllers: [ConsultasController],
  providers: [ConsultasService],
  exports:[ConsultasService]
})
export class ConsultasModule {}
