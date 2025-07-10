import { Module } from '@nestjs/common';
import { ConsultasService } from './consultas.service';
import { ConsultasController } from './consultas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consulta } from './entities/consulta.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisClientModule } from 'src/redis-client.module';

@Module({
  imports:[TypeOrmModule.forFeature([Consulta]),RedisClientModule],
  controllers: [ConsultasController],
  providers: [ConsultasService],
  exports:[ConsultasService]
})
export class ConsultasModule {}
