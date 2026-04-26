import { ExhibitionRepository } from './exhibition.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Exhibition } from 'src/core/db/entities/exhibition.entity';
import { OK, genUID } from 'src/core/misc/consts';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import { UpdateExhibitionDto } from './dto/update-exhibition.dto';
import { MediaCleanupService } from '../system/media-cleanup.service';
import { BaseMediaEntityService } from '../base/base-media-entity.service';

@Injectable()
export class ExhibitionService extends BaseMediaEntityService<Exhibition> {
  constructor(
    private exhibitionrepo: ExhibitionRepository,
    mediaCleanup: MediaCleanupService,
  ) {
    super(exhibitionrepo, mediaCleanup);
  }

  async create(dto: CreateExhibitionDto) {
    let code = genUID();
    await this.exhibitionrepo.createOrUpdate({
      ...dto,
      code: code,
      active: true,
      deleted: false,
    } as Exhibition);
    return { code: code, ...OK };
  }

  async findOne(code: string) {
    const honor = await this.exhibitionrepo.findOne({ code: code });
    if (!honor) throw new NotFoundException(`exhibition not found`);
    return {
      code: honor.code,
      title: honor.title,
      content: honor.content,
    };
  }

  async findAll() {
    const exhibition = await this.exhibitionrepo.findAll();
    if (!exhibition?.length) return [];
    return exhibition.map((ex) => {
      return {
        code: ex.code,
        title: ex.title,
        date: ex.createdAt,
        src: ex.src,
        tags: ex.tags,
        content: ex.content,
      };
    });
  }



  async update(code: string, dto: UpdateExhibitionDto) {
    // Use the base service method for update with media cleanup
    return this.updateWithMedia(code, dto, 'src', dto);
  }


  // You can remove your custom delete method and use the base one
  // Or override it if you need custom logic:
  async delete(code: string) {
    return this.deleteWithMedia(code, 'src');
  }
}
