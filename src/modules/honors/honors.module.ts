import { Module } from '@nestjs/common';
import { HonorsController } from './honors.controller';
import { HonorsService } from './honors.service';
import { HonorsRepository } from './honors.repository';
import { SystemModule } from '../system/system.module';

@Module({
  imports: [
    SystemModule,
  ],
  controllers: [HonorsController],
  providers: [HonorsService, HonorsRepository],
})
export class HonorsModule { }
