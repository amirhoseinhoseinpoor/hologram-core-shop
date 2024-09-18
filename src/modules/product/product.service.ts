import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from 'src/core/db/entities/product.entity';
import { ProductRepository } from './product.repository';
import { OK } from 'src/core/misc/consts';

@Injectable()
export class ProductService {
  constructor(private repo: ProductRepository) {}

  async create(dto: CreateProductDto) {
    await this.repo.createOrUpdate({
      ...dto,
      active: true,
      deleted: false,
    } as Product);
    return OK;
  }

  async findOne(id: number) {
    const product = await this.repo.findOne({ id });
    if (!product) throw new NotFoundException(`Product not found`);
    return { name: product.name, info: product.info, media: product.media };
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    await this.repo.createOrUpdate({ ...product, id: id } as Product);
    return OK;
  }
}
