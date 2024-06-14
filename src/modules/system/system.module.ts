import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { UploadRepository } from './upload.repository';

@Module({
  controllers: [SystemController],
  providers: [SystemService, UploadRepository],
})
export class SystemModule {}
