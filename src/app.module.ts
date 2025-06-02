import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario/entities/usuario.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
        entities: [Usuario], 
        synchronize: true,  
      }),
      inject: [ConfigService],
    }), 
    UsuarioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
