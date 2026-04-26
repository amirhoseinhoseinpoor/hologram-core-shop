import { Injectable, NotFoundException } from '@nestjs/common';
import { Banner } from 'src/core/db/entities/banner.entity';
import { OK, genUID } from 'src/core/misc/consts';
import { BannerRepository } from './banner.repository';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { CreateBannerDto } from './dto/create-banner.dto';
import { MediaCleanupService } from '../system/media-cleanup.service';
import { BaseMediaEntityService } from '../base/base-media-entity.service';

@Injectable()
export class BannerService extends BaseMediaEntityService<Banner>{
  constructor(
    private bannerRepo: BannerRepository,
    mediaCleanup: MediaCleanupService,
  ) {
    super(bannerRepo, mediaCleanup); // Call parent constructor
  }

  async create(dto: CreateBannerDto) {
    let code = genUID();
    await this.bannerRepo.createOrUpdate({
      ...dto,
      code: code,
      active: true,
      deleted: false,
    } as Banner);
    return { code: code, ...OK };
  }

  async findOne(code: string) {
    const honor = await this.bannerRepo.findOne({ code: code });
    if (!honor) throw new NotFoundException(`banner not found`);
    return {
      code: honor.code,
      title: honor.title,
      src: honor.src,
      link: honor.link,
    };
  }

  async findAll() {
    const honors = await this.bannerRepo.findAll();
    if (!honors?.length) return [];
    return honors.map((honor) => {
      return {
        code: honor.code,
        title: honor.title,
        date: honor.createdAt,
        src: honor.src,
        link: honor.link,
      };
    });
  }

  async update(code: string, dto: UpdateBannerDto) {
    // Use the base service method for update with media cleanup
    return this.updateWithMedia(code, dto, 'src', dto);
  }

  // You can remove your custom delete method and use the base one
  // Or override it if you need custom logic:
  async delete(code: string) {
    return this.deleteWithMedia(code, 'src');
  }
}
