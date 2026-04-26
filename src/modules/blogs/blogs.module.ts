import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogsRepository } from './blogs.repository';
import { SystemModule } from '../system/system.module';
import { BlogMediaHelper } from './blog-media.helper';

@Module({
  imports: [
    SystemModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository, BlogMediaHelper],
})
export class BlogsModule { }
