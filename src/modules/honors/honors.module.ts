import { Module } from '@nestjs/common';
import { HonorsController } from './honors.controller';
import { HonorsService } from './honors.service';
import { HonorsRepository } from './honors.repository';

@Module({
  controllers: [HonorsController],
  providers: [HonorsService, HonorsRepository],
})
export class HonorsModule {}
