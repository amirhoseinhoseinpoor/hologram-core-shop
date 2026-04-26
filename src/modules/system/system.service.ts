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
  constructor(private mediaRepo: MediaRepository) { }

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
    console.log(`=== SystemService.removeFile called for: ${fileName} ===`);

    const media = await this.mediaRepo.findByFileName(fileName);
    if (!media) {
      console.log(`File not found in database: ${fileName}`);
      return { success: false, message: 'File not found in database', ok: NOT_OK };
    }

    console.log(`Media found:`, {
      id: media.id,
      fileName: media.fileName,
      isPublic: media.isPublic,
      active: media.active,
      tag: media.tag
    });

    try {
      // Update database first
      console.log('Marking media as inactive in database...');
      media.active = false;
      await this.mediaRepo.createOrUpdate([media]);
      console.log('Media marked as inactive successfully');

      // Delete physical file if public
      if (media.isPublic) {
        const filePath = this.getFilePath(media);
        console.log(`Physical file path: ${filePath}`);

        if (existsSync(filePath)) {
          // Use unlinkSync to make sure it completes before returning
          unlinkSync(filePath);
          console.log(`✓ Physical file deleted successfully: ${filePath}`);
        } else {
          console.log(`⚠ Physical file not found on disk: ${filePath}`);
        }
      } else {
        console.log('Private file - keeping on disk');
      }

      console.log(`✓ File ${fileName} processed successfully`);
      return { success: true, message: 'File deleted', ok: OK };
    } catch (error) {
      console.error(`✗ Error deleting file ${fileName}:`, error);
      return { success: false, message: error.message, ok: NOT_OK };
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
