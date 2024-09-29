import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from 'src/core/db/entities/order.entity';
import { OrderRepository } from './order.repository';
import { OK, getUID6 } from 'src/core/misc/consts';

@Injectable()
export class OrderService {
  constructor(private repo: OrderRepository) {}

  async create(dto: CreateOrderDto) {
    let code = getUID6();
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
      docComment: order.docComment,
      chat: order.chat,
      delivery: order.delivery,
      payment: order.payment
    };
  }

  async findAll() {
    const orders = await this.repo.findAll();
    if (!orders?.length) return [];
    return orders.map((order) => {
      return {
        code: order.code,
        request: order.request,
        reqComment: order.reqComment,
        document: order.document,
        docComment: order.docComment,
        chat: order.chat,
        delivery: order.delivery,
        payment: order.payment
      };
    });
  }

  async update(code: string, dto: UpdateOrderDto) {
    const order = await this.repo.findOne({ code: code });
    if (!order) throw new NotFoundException(`Order not found`);
    Object.assign(order, dto);
    await this.repo.createOrUpdate({ ...order } as Order);
    return OK;
  }

  async delete(code: string) {
    const order = await this.repo.findOne({ code: code });
    if (!order) throw new NotFoundException(`Order not found`);
    // Object.assign(order, dto);
    await this.repo.createOrUpdate({ ...order } as Order);
    return OK;
  }
}
