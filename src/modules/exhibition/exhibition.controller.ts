import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import { ExhibitionService } from './exhibition.service';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import { UpdateExhibitionDto } from './dto/update-exhibition.dto';

import { Public } from 'src/core/decorator/public.decorator';
import { Provider } from 'src/core/decorator/provider.decorator';

@Controller('exhibition')
export class ExhibitionController {
  constructor(private readonly exhibitionService: ExhibitionService) {}

  @Post()
  // @Provider()
  create(@Body() dto: CreateExhibitionDto) {
    return this.exhibitionService.create(dto);
  }

  @Patch(':code')
  // @Provider()
  update(@Param('code') code: string, @Body() dto: UpdateExhibitionDto) {
    return this.exhibitionService.update(code, dto);
  }

  @Get('list')
  @Public()
  findAll() {
    return this.exhibitionService.findAll();
  }

  @Delete(':code')
  // @Provider()
  deleteOne(@Param('code') code: string) {
    return this.exhibitionService.update(code, {
      deleted: true,
    } as UpdateExhibitionDto);
  }
}
