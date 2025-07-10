import { Module } from '@nestjs/common';
import { TriagesService } from './triages.service';
import { TriagesController } from './triages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Triage } from './entities/triage.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Triage])],
  controllers: [TriagesController],
  providers: [TriagesService],
  exports:[TriagesService]
})
export class TriagesModule {}
