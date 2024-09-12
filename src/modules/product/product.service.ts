import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from 'src/core/db/entities/product.entity';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private repo: ProductRepository) {}

  asProduct(dto: CreateProductDto | UpdateProductDto) {
    return { ...dto, active: true, deleted: false } as Product;
  }

  async create(dto: CreateProductDto) {
    return await this.repo.createOrUpdate(this.asProduct(dto));
  }

  async findOne(id: number) {
    const product = await this.repo.findOne({ id });
    if (!product) throw new NotFoundException(`Product not found`);
    return { name: product.name, info: product.info, media: product.media };
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return await this.repo.createOrUpdate({...product, id: id} as Product);
  }
}
