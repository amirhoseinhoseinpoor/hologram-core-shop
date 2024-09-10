import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { Product } from 'src/core/db/entities/product.entity';
import { InsertProductDto } from './dto/insert-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private repo: ProductRepository,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return await this.repo.findAll();
  }

  async getProduct(id: number): Promise<Product> {
    const product = await this.repo.findOne({ id });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }
  

  async create(dto: InsertProductDto) {
    const oldProduct = await this.repo.findOne({ id: dto.id });
    if (oldProduct) {
      throw new BadRequestException('Product with this title already exists.');
    }
    const newProduct: Product = new Product();
    newProduct.title = dto.title;
    newProduct.info = dto.info || {};
    newProduct.media = dto.media || [];
  
  
    return await this.repo.createOrUpdate(newProduct);
  }

  async update(id: number, productData: Partial<Product>): Promise<Product> {
    const existingProduct = await this.getProduct(id);
    Object.assign(existingProduct, productData);
    return await this.repo.createOrUpdate(existingProduct);
  }

  async delete(id: number): Promise<void> {
    const product = await this.getProduct(id);
    product.active = false;
    product.deleted = true;
    await this.repo.createOrUpdate(product);
  }
}
