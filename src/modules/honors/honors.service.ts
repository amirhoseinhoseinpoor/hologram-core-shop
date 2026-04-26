import { Injectable, NotFoundException } from '@nestjs/common';
import { Honors } from 'src/core/db/entities/honors.entity';
import { CreateHonorDto } from './dto/create-honor.dto';
import { OK, genUID } from 'src/core/misc/consts';
import { HonorsRepository } from './honors.repository';
import { UpdateHonorDto } from './dto/update-honor.dto';
import { MediaCleanupService } from '../system/media-cleanup.service';
import { BaseMediaEntityService } from '../base/base-media-entity.service';

@Injectable()
export class HonorsService extends BaseMediaEntityService<Honors> {
  constructor(
    private honorsRepo: HonorsRepository,
    mediaCleanup: MediaCleanupService,
  ) {
    super(honorsRepo, mediaCleanup); // Call parent constructor
  }

  async create(dto: CreateHonorDto) {
    let code = genUID();
    await this.honorsRepo.createOrUpdate({
      ...dto,
      code: code,
      active: true,
      deleted: false,
    } as Honors);
    return { code: code, ...OK };
  }

  async findOne(code: string) {
    const honor = await this.honorsRepo.findOne({ code: code });
    if (!honor) throw new NotFoundException(`Honor not found`);
    return {
      code: honor.code,
      title: honor.title,
      content: honor.content,
    };
  }

  async findAll() {
    const honors = await this.honorsRepo.findAll();
    if (!honors?.length) return [];
    return honors.map((honor) => {
      return {
        code: honor.code,
        title: honor.title,
        date: honor.createdAt,
        src: honor.src,
        tags: honor.tags,
        content: honor.content,
      };
    });
  }


  async update(code: string, dto: UpdateHonorDto) {
    // Use the base service method for update with media cleanup
    return this.updateWithMedia(code, dto, 'src', dto);
  }

  // You can remove your custom delete method and use the base one
  // Or override it if you need custom logic:
  async delete(code: string) {
    return this.deleteWithMedia(code, 'src');
  }
}
