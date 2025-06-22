import { Module } from '@nestjs/common';
import { HistoriasService } from './historias.service';
import { HistoriasController } from './historias.controller';
import { Historia } from './entities/historia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Historia])],
  controllers: [HistoriasController],
  providers: [HistoriasService],
})
export class HistoriasModule {}
