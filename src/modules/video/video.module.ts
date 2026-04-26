import { SystemModule } from './../system/system.module';
import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { VideoRepository } from './video.repository';
import { VideoMediaHelper } from './video-media.helper';

@Module({
  imports: [
    SystemModule,  // Add this - now BannerModule can use MediaCleanupService
  ],
  controllers: [VideoController],
  providers: [VideoService, VideoRepository, VideoMediaHelper,],
})
export class VideoModule { }
