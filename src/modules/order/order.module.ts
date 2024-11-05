import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { ChatGateway } from './chat.gateway';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, ChatGateway],
})
export class OrderModule {}
