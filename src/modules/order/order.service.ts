import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Product } from 'src/core/db/entities/product.entity';
import { ProductRepository } from './order.repository';
import { OK, getUID6 } from 'src/core/misc/consts';

@Injectable()
export class ProductService {
  constructor(private repo: ProductRepository) {}

  async create(dto: CreateOrderDto) {
    let code = getUID6();
    await this.repo.createOrUpdate({ ...dto, code: code, active: true, deleted: false } as Product);
    return {code: code, ...OK};
  }

  async findOne(code: string) {
    const product = await this.repo.findOne({ code: code });
    if (!product) throw new NotFoundException(`Product not found`);
    return { code: product.code, name: product.name, info: product.info, media: product.media };
  }

  async findAll() {
    const products = await this.repo.findAll();
    if (!products?.length) return [];
    return products.map(prod => {
      return { code: prod.code, name: prod.name, info: prod.info, media: prod.media };
    });
  }

  async update(code: string, dto: UpdateOrderDto) {
    const product = await this.repo.findOne({ code: code });
    if (!product) throw new NotFoundException(`Product not found`);
    Object.assign(product, dto);
    await this.repo.createOrUpdate({...product} as Product);
    return OK;
  }
}
