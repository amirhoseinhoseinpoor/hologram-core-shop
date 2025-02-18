import { UsersRepository } from './../users/users.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from 'src/core/db/entities/product.entity';
import { ProductRepository } from './product.repository';
import { OK, genUID } from 'src/core/misc/consts';

@Injectable()
export class ProductService {
  constructor(
    private repo: ProductRepository,
    private userRepo: UsersRepository,
  ) { }

  async create(dto: CreateProductDto) {
    let code = genUID();
    await this.repo.createOrUpdate({
      ...dto,
      code: code,
      active: true,
      deleted: false,
    } as Product);
    return { code: code, ...OK };
  }

  async findOne(code: string) {
    const product = await this.repo.findOne({ code: code });
    if (!product) throw new NotFoundException(`Product not found`);
    return {
      code: product.code,
      name: product.name,
      info: product.info,
      media: product.media,
      filedOrder: product.filedOrder,
    };
  }

  async findAll() {
    const products = await this.repo.findAll();
    console.log(products);
    
    if (!products?.length) return [];
    return products.map((prod) => {
      return {
        code: prod.code,
        name: prod.name,
        info: prod.info,
        media: prod.media,
      };
    });
  }

  async findPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [blogs, total] = await this.repo.findAndCount({
      where: { deleted: false },
      order: { createdAt: 'DESC' },
      skip: skip,
      take: limit,
    });

    return {
      data: blogs,
      total: total,
      page: page,
      pageCount: Math.ceil(total / limit),
    };
  }

  async update(code: string, dto: UpdateProductDto) {
    const product = await this.repo.findOne({ code: code });
    if (!product) throw new NotFoundException(`Product not found`);
    Object.assign(product, dto);
    await this.repo.createOrUpdate({ ...product, code: code } as Product);
    return OK;
  }

  async countNonDeletedProducts() {
    return await this.repo.countNonDeleted();
  }

  async saveProduct(codeUser: string, codeProduct: string): Promise<void> {
    const user = await this.userRepo.findOne({ code: codeUser }, ['savedProducts']);
    const product = await this.repo.findOne({ code: codeProduct });

    if (!user) throw new NotFoundException('User not found');
    if (!product) throw new NotFoundException('Product not found');

    user.savedProducts.push(product);
    await this.userRepo.createOrUpdate(user);
  }

  async unsaveProduct(codeUser: string, codeProduct: string): Promise<void> {
    const user = await this.userRepo.findOne({ code: codeUser }, ['savedProducts']);
    const product = await this.repo.findOne({ code: codeProduct });

    if (!user) throw new NotFoundException('User not found');
    if (!product) throw new NotFoundException('Product not found');

    user.savedProducts = user.savedProducts.filter((p) => p.code !== codeProduct);
    await this.userRepo.createOrUpdate(user);
  }

  async getSavedProducts(codeUser: string): Promise<Product[]> {
    const user = await this.userRepo.findOne({ code: codeUser }, ['savedProducts']);

    if (!user) throw new NotFoundException('User not found');
    return user.savedProducts;
  }
  async getAllNamesAndNavIds() {
    const products = await this.repo.findAll();
    if (!products) throw new NotFoundException("No products found");
    return products.map(product => ({
      name: product.name,
      navId: product.navId,
    }));
  }
}
