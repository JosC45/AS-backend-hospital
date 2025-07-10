import { Module } from '@nestjs/common';
import { MedicosService } from './medicos.service';
import { MedicosController } from './medicos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medico } from './entities/medico.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisClientModule } from 'src/redis-client.module';

@Module({
  imports:[TypeOrmModule.forFeature([Medico]),UsuarioModule,RedisClientModule],
  controllers: [MedicosController],
  providers: [MedicosService],
})
export class MedicosModule {}
