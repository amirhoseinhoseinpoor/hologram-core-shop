import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { UsersRepository } from '../users/users.repository';
import { SystemModule } from '../system/system.module';
import { ProductMediaHelper } from './product-media.helper';

@Module({
  imports: [
    SystemModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, UsersRepository, ProductMediaHelper,],
})
export class ProductModule { }
