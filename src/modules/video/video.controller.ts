import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { Public } from 'src/core/decorator/public.decorator';
import { Provider } from 'src/core/decorator/provider.decorator';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  @Provider()
  create(@Body() dto: CreateVideoDto) {
    return this.videoService.create(dto);
  }

  @Patch(':code')
  @Provider()
  update(@Param('code') code: string, @Body() dto: UpdateVideoDto) {
    return this.videoService.update(code, dto);
  }

  @Get('list')
  @Public()
  findAll() {
    return this.videoService.findAll();
  }

  @Delete(':code')
  @Provider()
  deleteOne(@Param('code') code: string) {
    return this.videoService.update(code, {
      deleted: true,
    } as UpdateVideoDto);
  }
}
