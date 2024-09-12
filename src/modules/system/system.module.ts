import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { MediaRepository } from './media.repository';

@Module({
  controllers: [SystemController],
  providers: [SystemService, MediaRepository],
})
export class SystemModule {}
