import { Module } from '@nestjs/common';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { BannerRepository } from './banner.repository';
import { SystemModule } from '../system/system.module';

@Module({
    imports: [
    SystemModule,  // Add this - now BannerModule can use MediaCleanupService
  ],
  controllers: [BannerController],
  providers: [BannerService, BannerRepository],
})
export class BannerModule {}
