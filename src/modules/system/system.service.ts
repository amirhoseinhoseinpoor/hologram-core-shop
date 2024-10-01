import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
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
      files.push({
        tag: info.tag,
        type: +info.type,
        isPublic: info.isPublic,
        ...d,
        active: true,
      } as Media),
    );
    const result = await this.mediaRepo.createOrUpdate(files);
    return result.map((res) => ({
      fileName: res.fileName,
      originalName: res.originalName,
    }));
  }

  async removeFile(fileName: string) {
    const res = await this.mediaRepo.findOne(false, { fileName: fileName });
    if (!res) return NOT_OK;
    res.active = false;
    try {
      await this.mediaRepo.createOrUpdate([res]);
      return OK;
    } catch (e) {
      return NOT_OK;
    }
  }

  async getFiles(tag: string) {
    const files = await this.mediaRepo.findAll(false, { tag: tag });
    if (!files?.length) return [];
    return files.map((f) => ({
      fileName: f.fileName,
      originalName: f.originalName,
    }));
  }

  async getFile(filename: string) {
    const file = await this.mediaRepo.findOne(false, { fileName: filename });
    if (!file) return [];
    try {
      return readFileSync(
        join(process.cwd(), process.env.UPLOAD_LOCATION, filename),
      );
    } catch (e) {
      return NOT_OK;
    }
  }

  async getPublicFiles(tag: string) {
    const files = await this.mediaRepo.findAll(true, { tag: tag });
    if (!files?.length) return [];
    return files.map((f) => ({
      fileName: f.fileName,
      originalName: f.originalName,
    }));
  }

  async getPublicFile(filename: string): Promise<StreamableFile | string> {
    const file = await this.mediaRepo.findOne(true, { fileName: filename });
    if (!file) return 'File not found';

    try {
      const filePath = join(
        process.cwd(),
        process.env.UPLOAD_LOCATION,
        filename,
      );
      const fileStream = createReadStream(filePath);
      return new StreamableFile(fileStream);
    } catch (e) {
      console.error('Error reading file:', e);
      return 'Error reading file';
    }
  }
}
