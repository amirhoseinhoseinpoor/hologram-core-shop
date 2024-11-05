import { Injectable, NotFoundException } from '@nestjs/common';
import { Header } from 'src/core/db/entities/header.entity';
import { OK } from 'src/core/misc/consts';
import { HeaderRepository } from './header.repository';
import { UpdateHeaderDto } from './dto/update-header.dto';

@Injectable()
export class HeaderService {
  constructor(private repo: HeaderRepository) {}

  async create(dto: UpdateHeaderDto) {
    await this.repo.createOrUpdate({
      ...dto,
    } as Header);
    return { ...OK };
  }

  async findOne() {
    const honor = await this.repo.findOne({ id: '1' });
    if (!honor) throw new NotFoundException(`Header not found`);
    return {
      content: honor.content,
    };
  }

  async update(dto: UpdateHeaderDto) {
    const header = await this.repo.findOne({ id: '1' });
    if (!header) throw new NotFoundException(`Header not found`);
    Object.assign(header, dto);
    await this.repo.createOrUpdate({ ...header } as Header);
    return OK;
  }
}
