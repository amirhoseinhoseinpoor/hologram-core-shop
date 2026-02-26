import {
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { MediaRepository } from './media.repository';
import { MediaDto } from './dto/media-dto';
import { Media } from 'src/core/db/entities/media.entity';
import { createReadStream, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { NOT_OK, OK } from 'src/core/misc/consts';
import { MediaTypeDto } from './dto/media-type.dto';

@Injectable()
export class SystemService {
  constructor(private mediaRepo: MediaRepository) {}

  // Builds the full absolute path to a media file on disk.
  // Structure: {UPLOAD_LOCATION}/{public|private}/{tag}/{fileName}
  private getFilePath(media: Media): string {
    const base = process.env.UPLOAD_LOCATION || './uploads';
    const visibility = media.isPublic ? 'public' : 'private';
    const safeTag = media.tag
      .replace(/[/\\:*?"<>|]/g, '_')
      .replace(/\s+/g, '_');
    return join(process.cwd(), base, visibility, safeTag, media.fileName);
  }

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
    const res = await this.mediaRepo.findByFileName(fileName);
    if (!res) return NOT_OK;
    res.active = false;
    try {
      await this.mediaRepo.createOrUpdate([res]);
      // Public files are hard-deleted from disk to free storage.
      // Private files (orders, documents) are kept for audit/legal purposes.
      if (res.isPublic) {
        const filePath = this.getFilePath(res);
        if (existsSync(filePath)) {
          unlinkSync(filePath);
        }
      }
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

  async getFile(filename: string): Promise<StreamableFile | string> {
    const file = await this.mediaRepo.findOneFlexible(false, filename);
    if (!file) return 'File not found';

    try {
      const filePath = this.getFilePath(file);
      const fileStream = createReadStream(filePath);

      fileStream.on('error', (err) => {
        console.error('Stream error:', err);
        fileStream.destroy();
      });
      return new StreamableFile(fileStream);
    } catch (e) {
      console.error('Error reading file:', e);
      return 'Error reading file';
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
    const file = await this.mediaRepo.findOneFlexible(true, filename);
    if (!file) return 'File not found';

    try {
      const filePath = this.getFilePath(file);
      const fileStream = createReadStream(filePath);

      fileStream.on('error', (err) => {
        console.error('Stream error:', err);
        fileStream.destroy();
      });

      return new StreamableFile(fileStream);
    } catch (e) {
      console.error('Error reading file:', e);
      return 'Error reading file';
    }
  }
}
