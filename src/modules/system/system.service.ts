import { Injectable } from '@nestjs/common';
import { UploadRepository } from './upload.repository';
import { UploadDto } from './dto/upload-dto';
import { Upload } from 'src/core/db/entities/upload.entity';
import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';
import { NOT_OK } from 'src/core/misc/consts';

@Injectable()
export class SystemService {
  constructor(private uploadRepo: UploadRepository) {}

  async uploadFiles(tag: string, type: number, dto: UploadDto[]) {
    const files = [];
    dto?.forEach((d) =>
      files.push({ tag: tag, type: type, ...d, active: true } as Upload),
    );
    const result = await this.uploadRepo.createOrUpdate(files);
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
}
