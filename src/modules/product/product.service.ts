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

  async getProduct(titlt: string): Promise<Product> {
    const product = await this.repo.findOne({ titlt });
    if (!product) {
      throw new NotFoundException(`Product with titlt ${titlt} not found`);
    }
    return product;
  }

  async create(dto: InsertProductDto) {
    const oldProduct = await this.repo.findOne({ title: dto.title });
    if (oldProduct) {
      throw new BadRequestException('Product with this title already exists.');
    }
    const newProduct: Product = new Product();
    newProduct.title = dto.title;
    newProduct.active = dto.active !== undefined ? dto.active : true; // Set active status if provided, otherwise default to true
    newProduct.info = dto.info || {};
    newProduct.media = dto.media || [];
  
    // Save the new product using the repository's createOrUpdate method
    return await this.repo.createOrUpdate(newProduct);
  }

  async updateProduct(titlt: string, productData: Partial<Product>): Promise<Product> {
    const existingProduct = await this.getProduct(titlt);
    Object.assign(existingProduct, productData);
    return await this.repo.createOrUpdate(existingProduct);
  }

  async deleteProduct(title: string): Promise<void> {
    const product = await this.getProduct(title);
    product.active = false; // Soft delete
    await this.repo.createOrUpdate(product);
  }
}
