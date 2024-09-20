import { Module } from '@nestjs/common';
import { ProductService } from './order.service';
import { ProductController } from './order.controller';
import { OrderRepository } from './order.repository';

@Module({
  controllers: [ProductController],
  providers: [ProductService, OrderRepository],
})
export class ProductModule {}
