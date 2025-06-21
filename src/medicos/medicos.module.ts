import { Module } from '@nestjs/common';
import { MedicosService } from './medicos.service';
import { MedicosController } from './medicos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medico } from './entities/medico.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  imports:[TypeOrmModule.forFeature([Medico]),UsuarioModule],
  controllers: [MedicosController],
  providers: [MedicosService],
})
export class MedicosModule {}
