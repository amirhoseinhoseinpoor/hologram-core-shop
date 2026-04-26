import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Provider } from 'src/core/decorator/provider.decorator';
import { Public } from 'src/core/decorator/public.decorator';
import { Product } from 'src/core/db/entities/product.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @Provider()
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Patch(':code')
  @Provider()
  update(@Param('code') code: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(code, dto);
  }

  @Get('list')
  @Public()
  findAll() {
    return this.productService.findAll();
  }

  @Get('listPaginated')
  @Public()
  findAllPafinated(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.productService.findPaginated(Number(page), Number(limit))
  }

  @Get('count')
  @Public()
  countNonDeleted() {
    return this.productService.countNonDeletedProducts();
  }

  @Get('names-navIds')
  @Public()
  getAllNamesAndNavIds() {
    return this.productService.getAllNamesAndNavIds();
  }

  @Get(':code')
  @Public()
  findOne(@Param('code') code: string) {
    return this.productService.findOne(code);
  }

  @Delete(':code')
  @Provider()
  async deleteOne(@Param('code') code: string) {
    return this.productService.delete(code); // Call delete, not update
  }



  @Post(':code/like')
  async saveProduct(
    @Param('code') codeUser: string,
    @Body('productCode') codeProduct: string,
  ) {
    await this.productService.saveProduct(codeUser, codeProduct);
  }

  @Delete(':code/like')
  async unsaveProduct(
    @Param('code') codeUser: string,
    @Body('productCode') codeProduct: string,
  ) {
    await this.productService.unsaveProduct(codeUser, codeProduct);
  }

  @Get(':code/saved')
  async getSavedProducts(@Param('code') codeUser: string): Promise<Product[]> {
    return await this.productService.getSavedProducts(codeUser);
  }
}
