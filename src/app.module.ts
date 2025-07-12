import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario/entities/usuario.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { ENTITIES } from './entities';
import { TriagesModule } from './triages/triages.module';
import { MedicosModule } from './medicos/medicos.module';
import { PersonalModule } from './personal/personal.module';
import { AdminModule } from './admin/admin.module';
import { HistoriasModule } from './historias/historias.module';
import { HospitalizacionModule } from './hospitalizacion/hospitalizacion.module';
import { ConsultasModule } from './consultas/consultas.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisClientModule } from './redis-client.module';
import { NotasModule } from './notas/notas.module';
import { OrdenesModule } from './ordenes/ordenes.module';
import { CitasModule } from './citas/citas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: ENTITIES, 
        synchronize: false,  
      }),
      inject: [ConfigService],
    }), 
    RedisClientModule,
    UsuarioModule, AuthModule, PacientesModule, TriagesModule, MedicosModule, PersonalModule, AdminModule, HistoriasModule, HospitalizacionModule, ConsultasModule, NotasModule, OrdenesModule, CitasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
