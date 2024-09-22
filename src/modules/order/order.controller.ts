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
import { AssignOrderDto } from './dto/assign-order.dto';
import { Provider } from 'src/core/decorator/provider.decorator';
import { Public } from 'src/core/decorator/public.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Register an order
  @Post()
  @Provider()
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  // List all orders
  @Get('list')
  @Public()
  findAll() {
    return this.orderService.findAll();
  }

  // Get an order by tracking code
  @Get(':tracking')
  @Public()
  findOne(@Param('tracking') tracking: string) {
    return this.orderService.findOne(tracking);
  }

  // Update an order by tracking code
  @Patch(':tracking')
  @Provider()
  update(@Param('tracking') tracking: string, @Body() dto: UpdateOrderDto) {
    return this.orderService.update(tracking, dto);
  }

  // Delete an order by tracking code
  @Delete(':tracking')
  @Provider()
  deleteOne(@Param('tracking') tracking: string) {
    return this.orderService.delete(tracking);
  }

  // Assign an order from one user to another
  @Patch('assign')
  @Provider()
  assign(@Body() dto: AssignOrderDto) {
    return this.orderService.assignOrder(dto.tracking, dto.from, dto.to);
  }
}
