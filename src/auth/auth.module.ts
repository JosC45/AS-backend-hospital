import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { JwtModule} from '@nestjs/jwt';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports:[TypeOrmModule.forFeature([Usuario]),UsuarioModule,
            JwtModule.register({
              secret:process.env.JWT_SECRET || 'Azadache',
              signOptions:{expiresIn:'3h'}
            })],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
})
export class AuthModule {}
