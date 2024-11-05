import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { Public } from 'src/core/decorator/public.decorator';
import { Provider } from 'src/core/decorator/provider.decorator';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @Provider()
  create(@Body() dto: CreateBannerDto) {
    return this.bannerService.create(dto);
  }

  @Patch(':code')
  @Provider()
  update(@Param('code') code: string, @Body() dto: UpdateBannerDto) {
    return this.bannerService.update(code, dto);
  }

  @Get('list')
  @Public()
  findAll() {
    return this.bannerService.findAll();
  }

  @Delete(':code')
  @Provider()
  deleteOne(@Param('code') code: string) {
    return this.bannerService.update(code, {
      deleted: true,
    } as UpdateBannerDto);
  }
}
