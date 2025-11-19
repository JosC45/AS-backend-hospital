import { Module } from '@nestjs/common';
import { TriagesService } from './triages.service';
import { TriagesController } from './triages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Triage } from './entities/triage.entity';

import { ConsultasModule } from 'src/consultas/consultas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Triage]),
    ConsultasModule,
  ],
  controllers: [TriagesController],
  providers: [TriagesService],
  exports: [TriagesService]
})
export class TriagesModule { }