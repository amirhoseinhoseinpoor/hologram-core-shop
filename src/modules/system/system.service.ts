import { Injectable } from '@nestjs/common';
import { UploadRepository } from './upload.repository';
import { UploadDto } from './dto/upload-dto';
import { Upload } from 'src/core/db/entities/upload.entity';
import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class SystemService {
  constructor(private uploadRepo: UploadRepository) {}

  async uploadBanner(flag: number, dto: UploadDto[]) {
    let banners = await this.uploadRepo.findAll({ flag: flag });
    banners = banners.map((b) => ({ ...b, active: false }) as Upload);
    dto?.forEach((d) => {
      banners.push({ type: 1, flag: flag, ...d, active: true } as Upload);
    });
    return await this.uploadRepo.createOrUpdate(banners);
  }

  readFile(filename: string) {
    return readFileSync(join(process.cwd(), process.env.UPLOAD_LOCATION ,filename));
    // return createReadStream(join(process.cwd(), process.env.UPLOAD_LOCATION ,filename));
  }

  async landingData() {
    return {
      banners: await this.uploadRepo
        .findAll()
        .then((res) => res.map((r) => r.fileName)),
    };
  }
}
