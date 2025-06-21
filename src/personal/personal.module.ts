import { Module } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { PersonalController } from './personal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Personal } from './entities/personal.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  imports:[TypeOrmModule.forFeature([Personal]),UsuarioModule],
  controllers: [PersonalController],
  providers: [PersonalService],
})
export class PersonalModule {}
