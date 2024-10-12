import { Injectable, NotFoundException } from '@nestjs/common';
import { Video } from 'src/core/db/entities/video.entity';
import { VideoRepository } from './video.repository';
import { OK, genUID } from 'src/core/misc/consts';
import { UpdateVideoDto } from './dto/update-video.dto';
import { CreateVideoDto } from './dto/create-video.dto';

@Injectable()
export class VideoService {
  constructor(private repo: VideoRepository) {}

  async create(dto: CreateVideoDto) {
    let code = genUID();
    await this.repo.createOrUpdate({
      ...dto,
      code: code,
      active: true,
      deleted: false,
    } as Video);
    return { code: code, ...OK };
  }

  async findAll() {
    const video = await this.repo.findAll();
    if (!video?.length) return [];
    return video.map((vid) => {
      return {
        code: vid.code,
        media: vid.media,
      };
    });
  }

  async update(code: string, dto: UpdateVideoDto) {
    const product = await this.repo.findOne({ code: code });
    if (!product) throw new NotFoundException(`Product not found`);
    Object.assign(product, dto);
    await this.repo.createOrUpdate({ ...product, code: code } as Video);
    return OK;
  }
}
