import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { UsersRepository } from '../users/users.repository';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepository , UsersRepository],
})
export class ProductModule {}
