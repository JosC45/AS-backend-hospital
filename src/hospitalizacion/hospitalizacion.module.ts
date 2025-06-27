import { Module } from '@nestjs/common';
import { HospitalizacionService } from './hospitalizacion.service';
import { HospitalizacionController } from './hospitalizacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospitalizacion } from './entities/hospitalizacion.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Hospitalizacion])],
  controllers: [HospitalizacionController],
  providers: [HospitalizacionService],
})
export class HospitalizacionModule {}
