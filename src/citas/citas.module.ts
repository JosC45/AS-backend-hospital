import { Module } from '@nestjs/common';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';
import { Cita } from './entities/cita.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisClientModule } from 'src/redis-client.module';

@Module({
  imports:[TypeOrmModule.forFeature([Cita]),RedisClientModule],
  controllers: [CitasController],
  providers: [CitasService],
})
export class CitasModule {}
