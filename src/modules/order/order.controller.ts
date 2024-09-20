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

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Provider()
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Patch(':code')
  @Provider()
  update(@Param('code') code: string, @Body() dto: UpdateOrderDto) {
    return this.orderService.update(code, dto);
  }

  @Get('list')
  @Public()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':code')
  @Public()
  findOne(@Param('code') code: string) {
    return this.orderService.findOne(code);
  }

  @Delete(':code')
  @Provider()
  deleteOne(@Param('code') code: string) {
    return this.orderService.update(code, {
      deleted: true,
    } as UpdateOrderDto);
  }
}
