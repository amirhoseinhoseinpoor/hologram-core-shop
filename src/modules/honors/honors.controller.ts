import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import { HonorsService } from './honors.service';
import { CreateHonorDto } from './dto/create-honor.dto';
import { UpdateHonorDto } from './dto/update-honor.dto';
import { Public } from 'src/core/decorator/public.decorator';
import { Provider } from 'src/core/decorator/provider.decorator';

@Controller('honors')
export class HonorsController {
  constructor(private readonly honorsService: HonorsService) {}

  @Post()
  @Provider()
  create(@Body() dto: CreateHonorDto) {
    return this.honorsService.create(dto);
  }

  @Patch(':code')
  @Provider()
  update(@Param('code') code: string, @Body() dto: UpdateHonorDto) {
    return this.honorsService.update(code, dto);
  }

  @Get('list')
  @Public()
  findAll() {
    return this.honorsService.findAll();
  }

  @Delete(':code')
  @Provider()
  deleteOne(@Param('code') code: string) {
    return this.honorsService.delete(code);
  }
}
