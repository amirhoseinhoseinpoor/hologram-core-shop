import { ExhibitionRepository } from './exhibition.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Exhibition } from 'src/core/db/entities/exhibition.entity';
import { OK, genUID } from 'src/core/misc/consts';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import { UpdateExhibitionDto } from './dto/update-exhibition.dto';

@Injectable()
export class ExhibitionService {
  constructor(private repo: ExhibitionRepository) {}

  async create(dto: CreateExhibitionDto) {
    let code = genUID();
    await this.repo.createOrUpdate({
      ...dto,
      code: code,
      active: true,
      deleted: false,
    } as Exhibition);
    return { code: code, ...OK };
  }

  async findOne(code: string) {
    const honor = await this.repo.findOne({ code: code });
    if (!honor) throw new NotFoundException(`exhibition not found`);
    return {
      code: honor.code,
      title: honor.title,
      content: honor.content,
    };
  }

  async findAll() {
    const exhibition = await this.repo.findAll();
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
    const exhibition = await this.repo.findOne({ code: code });
    if (!exhibition) throw new NotFoundException(`exhibition not found`);
    Object.assign(exhibition, dto);
    await this.repo.createOrUpdate({ ...exhibition, code: code } as Exhibition);
    return OK;
  }
}
