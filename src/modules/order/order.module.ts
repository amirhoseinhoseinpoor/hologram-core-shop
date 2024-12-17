import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { ChatGateway } from '../gateways/chat.gateway';
import { GateWaysModule } from '../gateways/gateways.module';

@Module({
  imports: [GateWaysModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, ChatGateway],
})
export class OrderModule {}
