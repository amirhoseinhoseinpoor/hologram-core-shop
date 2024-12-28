import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Provider } from 'src/core/decorator/provider.decorator';
import { Public } from 'src/core/decorator/public.decorator';
import { RequestOrderDto } from './dto/request-order.dto';
import { ReqCommentOrderDto } from './dto/reqComment-order-dto';
import { DocumentOrderDto } from './dto/document-order-dto';
import { DocCommentOrderDto } from './dto/docComment-order.dto';
import { ChatOrderDto } from './dto/chat-order.dto';
import { DeliveryOrderDto } from './dto/delivery-order.dto';
import { PaymentOrderDto } from './dto/payment-order.dto';
import { OtherOrderDto } from './dto/other-order.dto';
import { CountOrderDto } from './dto/count-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('request')
  createRequest(@Body() dto: RequestOrderDto) {
    return this.orderService.create(dto);
  }

  @Patch('request/:code/comment')
  @Provider()
  UpdateRequestComment(
    @Param('code') code: string,
    @Body() dto: ReqCommentOrderDto,
  ) {
    return this.orderService.update(code, dto);
  }

  @Patch('document/:code')
  UpdateDocument(@Param('code') code: string, @Body() dto: DocumentOrderDto) {
    return this.orderService.update(code, dto);
  }

  @Patch('chatImage/:code')
  @Provider()
  UpdateDocumentComment(
    @Param('code') code: string,
    @Body() dto: DocCommentOrderDto,
  ) {
    return this.orderService.update(code, dto);
  }

  @Patch('chat/:code')
  UpdateChat(@Param('code') code: string, @Body() dto: ChatOrderDto) {
    return this.orderService.update(code, dto);
  }

  @Patch('delivery/:code')
  UpdateDelivery(@Param('code') code: string, @Body() dto: DeliveryOrderDto) {
    return this.orderService.update(code, dto);
  }

  @Patch('payment/:code')
  @Provider()
  UpdatePayment(@Param('code') code: string, @Body() dto: PaymentOrderDto) {
    return this.orderService.update(code, dto);
  }

  @Patch('status/:code/:status')
  // @Provider()
  UpdateStatus(@Param('code') code: string, @Param('status') status: string) {
    return this.orderService.update(code, {
      status: +status,
      deleted: false,
    } as OtherOrderDto);
  }

  @Get('count')
  @Public()
  countOrders(@Query('status') status?: number): Promise<CountOrderDto> {
    return this.orderService.countOrders({ status });
  }

  @Get('list')
  @Provider()
  findAll(
    @Query('status') status: number,
    @Query('sortBy') sortBy: string = 'createdAt', // Default to 'createdAt'
    @Query('sortOrder') sortOrder: string = 'ASC', // Default to 'ASC'
    @Query('page') page: number = 1, // Default to page 1
    @Query('limit') limit: number = 10,
  ) {
    // Ensure page and limit are positive integers
    const validatedPage = Math.max(1, page);
    const validatedLimit = Math.max(1, limit);

    return this.orderService.findAll({
      status,
      sortBy,
      sortOrder,
      page: validatedPage,
      limit: validatedLimit,
    });
  }

  @Get('find/:code')
  findOne(@Param('code') code: string) {
    return this.orderService.findOne(code);
  }

  @Patch('step/:code/:step')
  // @Provider()
  UpdateStep(@Param('code') code: string, @Param('step') step: string) {
    return this.orderService.update(code, {
      step: +step,
      deleted: false,
    } as OtherOrderDto);
  }

  @Get('findById')
  findById() {
    return this.orderService.findById();
  }

  @Delete('deleteById/:code')
  DeleteById(@Param('code') code: string) {
    return this.orderService.update(code, {
      deleted: true,
    } as OtherOrderDto);
  }

  @Delete(':code')
  // @Provider()
  deleteOne(@Param('code') code: string) {
    return this.orderService.delete(code);
  }
}
