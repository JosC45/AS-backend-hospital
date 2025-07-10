import { Module } from '@nestjs/common';
import { NotasService } from './notas.service';
import { NotasController } from './notas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospitalizacion } from 'src/hospitalizacion/entities/hospitalizacion.entity';
import { Medico } from 'src/medicos/entities/medico.entity';
import { Nota } from './entities/nota.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Nota,Hospitalizacion,Medico])],
  controllers: [NotasController],
  providers: [NotasService],
})
export class NotasModule {}
