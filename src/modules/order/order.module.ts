import { Module } from '@nestjs/common';
import { ProductService } from './order.service';
import { ProductController } from './order.controller';
import { ProductRepository } from './order.repository';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
