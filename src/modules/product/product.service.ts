import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { Product } from 'src/core/db/entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(dto: InsertProductDto): Promise<Product> {
    const product = this.productRepository.createOrUpdate(productData as Product);
    return product;
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    const existingProduct = await this.getProductById(id);
    Object.assign(existingProduct, productData);
    return await this.productRepository.createOrUpdate(existingProduct);
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.getProductById(id);
    product.deleted = true; // Soft delete
    await this.productRepository.createOrUpdate(product);
  }
}
