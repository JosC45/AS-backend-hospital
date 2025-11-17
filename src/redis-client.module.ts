import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REDIS_CLIENT',
        transport: Transport.REDIS,
        options: {
            host: 'localhost',
          port: 6379,
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RedisClientModule {}