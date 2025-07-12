import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TCP_CLIENT',
        transport: Transport.TCP,
        options: {
          host: '2.tcp.ngrok.io',
          port: 13527,
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RedisClientModule {}