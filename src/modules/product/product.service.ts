import { UsersRepository } from './../users/users.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from 'src/core/db/entities/product.entity';
import { ProductRepository } from './product.repository';
import { OK, genUID } from 'src/core/misc/consts';
import { MediaCleanupService } from '../system/media-cleanup.service';
import { ProductMediaHelper } from './product-media.helper';

@Injectable()
export class ProductService {

    constructor(
    private repo: ProductRepository,
    private userRepo: UsersRepository,
    private mediaCleanup: MediaCleanupService,
    private productMediaHelper: ProductMediaHelper,
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
    const product = await this.repo.findOne(code);
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
    console.log(`=== Updating Product: ${code} ===`);
    
    // Get existing product (include deleted to check)
    const existingProduct = await this.repo.findOne(code, true);
    if (!existingProduct) throw new NotFoundException(`Product not found`);
    
    // Check for deleted media files
    const hasInfoChanged = dto.info && JSON.stringify(dto.info) !== JSON.stringify(existingProduct.info);
    const hasMediaChanged = dto.media && JSON.stringify(dto.media) !== JSON.stringify(existingProduct.media);
    
    if (hasInfoChanged || hasMediaChanged) {
      console.log('Product content changed, checking for files to delete...');
      
      const deletedFiles = this.productMediaHelper.findDeletedFiles(
        existingProduct.info,
        existingProduct.media,
        dto.info || existingProduct.info,
        dto.media || existingProduct.media
      );
      
      if (deletedFiles.length > 0) {
        await this.mediaCleanup.deleteMultipleMedia(deletedFiles);
      }
    }
    
    // Update the product
    Object.assign(existingProduct, dto);
    await this.repo.createOrUpdate(existingProduct);
    
    return OK;
  }

  async delete(code: string) {
    console.log(`=== Deleting Product: ${code} ===`);
    
    // Get the product
    const product = await this.repo.findOne(code, true);
    if (!product) throw new NotFoundException(`Product not found`);
    
    // Delete all media files
    let deletedCount = 0;
    if (product.info || product.media) {
      console.log('Extracting media files from product...');
      const result = await this.productMediaHelper.deleteAllProductMedia(
        product.info,
        product.media
      );
      deletedCount = result.deleted;
      console.log(`Deleted ${deletedCount} media files`);
    }
    
    // Soft delete the product
    product.deleted = true;
    await this.repo.createOrUpdate(product);
    
    console.log(`Product ${code} soft deleted successfully`);
    
    return { message: 'Deleted successfully', mediaDeleted: deletedCount };
  }

  async countNonDeletedProducts() {
    return await this.repo.countNonDeleted();
  }

  async saveProduct(codeUser: string, codeProduct: string): Promise<void> {
    const user = await this.userRepo.findOne({ code: codeUser }, ['savedProducts']);
    const product = await this.repo.findOne(codeProduct);

    if (!user) throw new NotFoundException('User not found');
    if (!product) throw new NotFoundException('Product not found');

    user.savedProducts.push(product);
    await this.userRepo.createOrUpdate(user);
  }

  async unsaveProduct(codeUser: string, codeProduct: string): Promise<void> {
    const user = await this.userRepo.findOne({ code: codeUser }, ['savedProducts']);
    const product = await this.repo.findOne(codeProduct);

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
