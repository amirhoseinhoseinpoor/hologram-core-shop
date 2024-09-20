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
    await this.repo.createOrUpdate({ ...dto, code: code, paid: false, finish: false, deleted: false } as Order);
    return {code: code, ...OK};
  }

  async findOne(code: string) {
    const order = await this.repo.findOne({ code: code });
    if (!order) throw new NotFoundException(`Order not found`);
    return { code: order.code, info: order.info, products: order.products };
  }

  async findAll() {
    const orders = await this.repo.findAll();
    if (!orders?.length) return [];
    return orders.map(ord => {
      return { code: ord.code, info: ord.info, products: ord.products };
    });
  }

  async update(code: string, dto: UpdateOrderDto) {
    const order = await this.repo.findOne({ code: code });
    if (!order) throw new NotFoundException(`Order not found`);
    Object.assign(order, dto);
    await this.repo.createOrUpdate({...order} as Order);
    return OK;
  }
}
