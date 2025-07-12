import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TCP_CLIENT',
        transport: Transport.TCP,
        options: {
          host: '4.tcp.ngrok.io',
          port: 17128,
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RedisClientModule {}