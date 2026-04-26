import { Injectable, NotFoundException } from '@nestjs/common';
import { Video } from 'src/core/db/entities/video.entity';
import { VideoRepository } from './video.repository';
import { OK, genUID } from 'src/core/misc/consts';
import { UpdateVideoDto } from './dto/update-video.dto';
import { CreateVideoDto } from './dto/create-video.dto';
import { MediaCleanupService } from '../system/media-cleanup.service';
import { VideoMediaHelper } from './video-media.helper';
@Injectable()
export class VideoService {
  constructor(
    private videoRepo: VideoRepository,
    private mediaCleanup: MediaCleanupService,
    private videoMediaHelper: VideoMediaHelper,
  ) { }


  async create(dto: CreateVideoDto) {
    let code = genUID();
    await this.videoRepo.createOrUpdate({
      ...dto,
      code: code,
      active: true,
      deleted: false,
    } as Video);
    return { code: code, ...OK };
  }

  async findOne(code: string) {
    const video = await this.videoRepo.findOne({ code: code });
    if (!video) throw new NotFoundException(`Video not found`);
    return {
      code: video.code,
      media: video.media,
    };
  }


  async findAll() {
    const video = await this.videoRepo.findAll();
    if (!video?.length) return [];
    return video.map((vid) => {
      return {
        code: vid.code,
        media: vid.media,
      };
    });
  }



  async update(code: string, dto: UpdateVideoDto) {
    console.log(`=== Updating Video: ${code} ===`);

    // Get existing video (include deleted to check)
    const existingVideo = await this.videoRepo.findOne({ code: code }, true);
    if (!existingVideo) throw new NotFoundException(`Video not found`);

    // Check if media changed and delete removed files
    const hasMediaChanged = dto.media && JSON.stringify(dto.media) !== JSON.stringify(existingVideo.media);

    if (hasMediaChanged) {
      console.log('Video media changed, checking for files to delete...');

      const deletedFiles = this.videoMediaHelper.findDeletedFiles(
        existingVideo.media,
        dto.media
      );

      if (deletedFiles.length > 0) {
        await this.mediaCleanup.deleteMultipleMedia(deletedFiles);
      }
    }

    // Update the video
    Object.assign(existingVideo, dto);
    await this.videoRepo.createOrUpdate(existingVideo);

    return OK;
  }

  async delete(code: string) {
    console.log(`=== Deleting Video: ${code} ===`);

    // Get the video (include deleted to find even if already deleted)
    const video = await this.videoRepo.findOne({ code: code }, true);
    if (!video) throw new NotFoundException(`Video not found`);

    // Delete all media files
    let deletedCount = 0;
    if (video.media) {
      console.log('Extracting media files from video...');
      const result = await this.videoMediaHelper.deleteAllVideoMedia(video.media);
      deletedCount = result.deleted;
      console.log(`Deleted ${deletedCount} media files`);
    }

    // Soft delete the video
    video.deleted = true;
    await this.videoRepo.createOrUpdate(video);

    console.log(`Video ${code} soft deleted successfully`);

    return OK;
  }
}
