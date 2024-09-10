import { Body, Controller, Delete, Get, Param, Patch, UseInterceptors } from '@nestjs/common';
import { TransactionInterceptor } from 'src/core/db/transaction.interceptor';
import { GetProductDto } from './dto/select-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('users')
export class UsersController {
  constructor(private productService: ProductService) {}

  @UseInterceptors(TransactionInterceptor)
  @Patch(':code')
  update(@Param('code') code: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(code, dto);
  }

  @Get()
  find(@Body() dto: GetProductDto) {
    return this.productService.getProduct(dto.id);
  }

  @UseInterceptors(TransactionInterceptor)
  @Delete(':code')
  remove(@Param('code') id: number) {
    return this.productService.remove(id);
  }

}
