import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Body,
  Delete,
  Query,
} from '@nestjs/common';

import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Public } from 'src/core/decorator/public.decorator';
import { Provider } from 'src/core/decorator/provider.decorator';


@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) { }

  @Post()
  // @Provider()
  create(@Body() dto: CreateBlogDto) {
    return this.blogsService.create(dto);
  }

  @Patch(':code')
  // @Provider()
  update(@Param('code') code: string, @Body() dto: UpdateBlogDto) {
    return this.blogsService.update(code, dto);
  }

  @Get('list')
  @Public()
  findAll() {
    return this.blogsService.findAll();
  }

  @Get('listPaginated')
  @Public()
  async findAllPaginated(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.blogsService.findPaginated(Number(page), Number(limit));
  }


  @Delete(':code')
  // @Provider()
  deleteOne(@Param('code') code: string) {
    return this.blogsService.update(code, {
      deleted: true,
    } as UpdateBlogDto);
  }
}
