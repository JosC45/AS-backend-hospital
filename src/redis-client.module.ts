import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REDIS_EMITER',
        transport: Transport.REDIS,
        options: {
            host: '127.0.0.1',
            port: 6379,
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RedisClientModule {}