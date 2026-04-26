import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { MediaRepository } from './media.repository';
import { MediaCleanupService } from './media-cleanup.service';

@Module({
  controllers: [SystemController],
  providers: [SystemService, MediaRepository, MediaCleanupService],
  exports: [
    SystemService,
    MediaCleanupService  // IMPORTANT: Export it so other modules can use it
  ],
})
export class SystemModule { }
