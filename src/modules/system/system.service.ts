import { Injectable } from '@nestjs/common';
import { UploadRepository } from './upload.repository';
import { UploadDto } from './dto/upload-dto';
import { Upload } from 'src/core/db/entities/upload.entity';

@Injectable()
export class SystemService {
  constructor(private uploadRepo: UploadRepository) {}

  async uploadBanner(dto: UploadDto[]) {
    let banners = await this.uploadRepo.findAll({});
    banners = banners.map((b) => ({ ...b, active: false }) as Upload);

    dto.forEach((d) => {
      banners.push({ type: 1, ...d, active: true } as Upload);
    });

    return await this.uploadRepo.createOrUpdate(banners);
  }
}
