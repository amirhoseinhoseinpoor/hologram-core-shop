import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { ProductController } from './order.controller';
import { OrderRepository } from './order.repository';

@Module({
  controllers: [ProductController],
  providers: [OrderService, OrderRepository],
})
export class ProductModule {}
