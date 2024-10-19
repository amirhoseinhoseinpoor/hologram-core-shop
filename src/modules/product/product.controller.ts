import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Provider } from 'src/core/decorator/provider.decorator';
import { Public } from 'src/core/decorator/public.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  // @Provider()
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Patch(':code')
  // @Provider()
  update(@Param('code') code: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(code, dto);
  }

  @Get('list')
  @Public()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':code')
  // @Public()
  findOne(@Param('code') code: string) {
    return this.productService.findOne(code);
  }

  @Delete(':code')
  // @Provider()
  deleteOne(@Param('code') code: string) {
    return this.productService.update(code, {
      deleted: true,
    } as UpdateProductDto);
  }
}
