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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST')||'localhost',
        port: configService.get<number>('DB_PORT')||3306,
        username: configService.get<string>('DB_USER')||'root',
        password: configService.get<string>('DB_PASSWORD')||'12345',
        database: configService.get<string>('DB_NAME'),
        entities: ENTITIES, 
        synchronize: false,  
      }),
      inject: [ConfigService],
    }), 
    UsuarioModule, AuthModule, PacientesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
