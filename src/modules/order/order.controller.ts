import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Provider } from 'src/core/decorator/provider.decorator';
import { Public } from 'src/core/decorator/public.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: OrderService) {}

  @Post()
  @Provider()
  create(@Body() dto: CreateOrderDto) {
    return this.productService.create(dto);
  }

  @Patch(':code')
  @Provider()
  update(@Param('code') code: string, @Body() dto: UpdateOrderDto) {
    return this.productService.update(code, dto);
  }

  @Get('list')
  @Public()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':code')
  @Public()
  findOne(@Param('code') code: string) {
    return this.productService.findOne(code);
  }

  @Delete(':code')
  @Provider()
  deleteOne(@Param('code') code: string) {
    return this.productService.update(code, {
      deleted: true,
    } as UpdateOrderDto);
  }
}
