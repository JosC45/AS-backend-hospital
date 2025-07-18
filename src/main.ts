import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform:true,
    whitelist:true,
    forbidNonWhitelisted:true
  }))
  app.enableCors()
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
