import { BadRequestException, Injectable } from '@nestjs/common';
import { MediaRepository } from './media.repository';
import { MediaDto } from './dto/media-dto';
import { Media } from 'src/core/db/entities/media.entity';
import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';
import { NOT_OK, OK } from 'src/core/misc/consts';
import { MediaTypeDto } from './dto/media-type.dto';

@Injectable()
export class SystemService {
  constructor(private mediaRepo: MediaRepository) {}

  async uploadFiles(info: MediaTypeDto, dto: MediaDto[]) {
    const files = [];
    dto?.forEach((d) =>
      files.push({ tag: info.tag, type: +info.type, isPublic: info.isPublic, ...d, active: true } as Media),
    );
    const result = await this.mediaRepo.createOrUpdate(files);
    return result.map((res) => ({
      fileName: res.fileName,
      originalName: res.originalName,
    }));
  }

  downloadFile(filename: string) {
    try {
      return readFileSync(
        join(process.cwd(), process.env.UPLOAD_LOCATION, filename),
      );
    } catch (e) {
      return NOT_OK;
    }
    // return createReadStream(join(process.cwd(), process.env.UPLOAD_LOCATION ,filename));
  }

  async removeFile(fileName: string) {
    const res = await this.mediaRepo.findOne({ fileName: fileName });
    if (!res) return NOT_OK;
    res.active = false;
    try {
      await this.mediaRepo.createOrUpdate([res]);
      return OK;
    } catch (e) {
      return NOT_OK;
    }
  }

  async getPublicFiles(tag: string) {
    // const res = await this.mediaRepo.findAll({ fileName: fileName });
    // if (!res) return NOT_OK;
    // res.active = false;
    // try {
    //   await this.mediaRepo.createOrUpdate([res]);
    //   return OK;
    // } catch (e) {
    //   return NOT_OK;
    // }
  }

}
