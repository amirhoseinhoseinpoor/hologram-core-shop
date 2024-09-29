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

  @Post('request')
  createRequest(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Patch('request/:code/comment')
  @Provider()
  UpdateRequestComment(
    @Param('code') code: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.orderService.update(code, dto);
  }

  @Patch('document/:code')
  UpdateDocument(@Param('code') code: string, @Body() dto: UpdateOrderDto) {
    return this.orderService.update(code, dto);
  }

  @Patch('document/:code/comment')
  @Provider()
  UpdateDocumentComment(
    @Param('code') code: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.orderService.update(code, dto);
  }

  @Patch('chat/:code')
  UpdateChat(@Param('code') code: string, @Body() dto: UpdateOrderDto) {
    return this.orderService.update(code, dto);
  }

  @Patch('delivery/:code')
  UpdateDelivery(@Param('code') code: string, @Body() dto: UpdateOrderDto) {
    return this.orderService.update(code, dto);
  }

  @Patch('payment/:code')
  UpdatePayment(@Param('code') code: string, @Body() dto: UpdateOrderDto) {
    return this.orderService.update(code, dto);
  }

  @Patch('status/:code/:status')
  @Provider()
  UpdateStatus(@Param('code') code: string, @Param('status') status: string) {
    return this.orderService.update(code, {
      status: +status,
    } as UpdateOrderDto);
  }

  @Get('list')
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.orderService.findOne(code);
  }

  @Delete(':code')
  @Provider()
  deleteOne(@Param('code') code: string) {
    return this.orderService.update(code, { deleted: true } as UpdateOrderDto);
  }
}
