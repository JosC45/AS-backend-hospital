import { Module } from '@nestjs/common';
import { HistoriasService } from './historias.service';
import { HistoriasController } from './historias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Historia } from './entities/historia.entity';
import { Hospitalizacion } from 'src/hospitalizacion/entities/hospitalizacion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Historia,
      Hospitalizacion
    ]),
  ],
  controllers: [HistoriasController],
  providers: [HistoriasService],
})
export class HistoriasModule {}