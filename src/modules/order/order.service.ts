import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Order } from 'src/core/db/entities/order.entity';
import { OrderRepository } from './order.repository';
import { OK, genUID } from 'src/core/misc/consts';
import { RequestOrderDto } from './dto/request-order.dto';
import { ReqCommentOrderDto } from './dto/reqComment-order-dto';
import { DocumentOrderDto } from './dto/document-order-dto';
import { DocCommentOrderDto } from './dto/docComment-order.dto';
import { ChatOrderDto } from './dto/chat-order.dto';
import { DeliveryOrderDto } from './dto/delivery-order.dto';
import { PaymentOrderDto } from './dto/payment-order.dto';
import { OtherOrderDto } from './dto/other-order.dto';
import { ChatGateway } from '../gateways/chat.gateway';
import { CountOrderDto } from './dto/count-order.dto';

@Injectable()
export class OrderService {
  constructor(
    private repo: OrderRepository,
    private chatGateway: ChatGateway,
  ) {}

  async create(dto: RequestOrderDto) {
    let code = genUID();
    await this.repo.createOrUpdate({
      ...dto,
      code: code,
      deleted: false,
    } as Order);
    return { code: code, ...OK };
  }

  async findOne(code: string) {
    const order = await this.repo.findOne({ code: code });
    if (!order) throw new NotFoundException(`Order not found`);
    return {
      code: order.code,
      request: order.request,
      reqComment: order.reqComment,
      document: order.document,
      chatImage: order.chatImage,
      chat: order.chat,
      delivery: order.delivery,
      payment: order.payment,
    };
  }

  async findById() {
    const orders = await this.repo.findById();
    if (!orders || orders.length === 0) {
      throw new NotFoundException(`Order not found`);
    }

    return orders.map((order) => ({
      code: order.code,
      status: order.status,
      step: order.step,
      request: order.request,
      reqComment: order.reqComment,
      document: order.document,
      chatImage: order.chatImage,
      chat: order.chat,
      delivery: order.delivery,
      payment: order.payment,
      createdAt: order.createdAt,
    }));
  }

  async deleteById(code: string, dto: OtherOrderDto) {
    const orders = await this.repo.findById();
    if (!orders || orders.length === 0) {
      throw new NotFoundException(`Order not found`);
    }

    const exactOrder = orders.find((order) => {
      order.code == code;
    });

    if (!exactOrder) {
      throw new NotFoundException(`Order with code ${code} not found`);
    }

    Object.assign(exactOrder, dto);
    await this.repo.createOrUpdate({ ...exactOrder } as Order);
  }

  async findAll(filters: {
    status?: number;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, sortBy, sortOrder, page, limit } = filters;

    // Fetch paginated data and total count
    const { data: orders, total } = await this.repo.findAllQuery({
      status,
      sortBy,
      sortOrder,
      page,
      limit,
    });

    // Map the orders to the desired format
    const mappedOrders = orders.map((order) => ({
      code: order.code,
      createdBy: order.createdBy,
      date: order.createdAt,
      status: order.status,
      step: order.step,
      request: order.request,
      reqComment: order.reqComment,
      document: order.document,
      chatImage: order.chatImage,
      chat: order.chat,
      delivery: order.delivery,
      payment: order.payment,
    }));

    return {
      data: mappedOrders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(
    code: string,
    dto:
      | ReqCommentOrderDto
      | DocumentOrderDto
      | DocCommentOrderDto
      | ChatOrderDto
      | DeliveryOrderDto
      | PaymentOrderDto
      | OtherOrderDto,
  ) {
    const order = await this.repo.findOne({ code: code });
    if (!order) throw new NotFoundException(`Order not found`);
    Object.assign(order, dto);
    await this.repo.createOrUpdate({ ...order } as Order);

    // Check if the update involves the chat
    if ('chat' in dto) {
      // Emit event to clients
      this.chatGateway.sendMessage('chatUpdate', {
        code: code,
        chat: dto['chat'],
      });
    }
    return OK;
  }

  async delete(code: string) {
    const order = await this.repo.findOne({ code: code });
    if (!order) throw new NotFoundException(`Order not found`);
    // Object.assign(order, dto);
    await this.repo.createOrUpdate({ ...order } as Order);
    return OK;
  }

  async countOrders(filters: { status?: number }): Promise<CountOrderDto> {
    try {
      const count = await this.repo.countOrder(filters);
      return { count };
    } catch (error) {
      console.error('Error counting orders:', error);
      throw new InternalServerErrorException('Failed to count orders');
    }
  }
}
