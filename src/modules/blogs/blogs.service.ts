import { Injectable, NotFoundException } from '@nestjs/common';
import { Blogs } from 'src/core/db/entities/blogs.entity';
import { BlogsRepository } from './blogs.repository';
import { OK, genUID } from 'src/core/misc/consts';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { MediaCleanupService } from '../system/media-cleanup.service';
import { BaseMediaEntityService } from '../base/base-media-entity.service';
import { BlogMediaHelper } from './blog-media.helper';

@Injectable()
export class BlogsService extends BaseMediaEntityService<Blogs> {
  constructor(
    private blogsRepo: BlogsRepository,
    mediaCleanup: MediaCleanupService,
    private blogMediaHelper: BlogMediaHelper,
  ) {
    super(blogsRepo, mediaCleanup);
  }


  async create(dto: CreateBlogDto) {
    let code = genUID();
    await this.blogsRepo.createOrUpdate({
      ...dto,
      code: code,
      active: true,
      deleted: false,
    } as Blogs);
    return { code: code, ...OK };
  }

  async findOne(code: string) {
    const blogs = await this.blogsRepo.findOne({ code: code });
    if (!blogs) throw new NotFoundException(`Blogs not found`);
    return {
      code: blogs.code,
      date: blogs.createdAt,
      content: blogs.content,
    };
  }

  async findAll() {
    const blogs = await this.blogsRepo.findAll();
    if (!blogs?.length) return [];
    return blogs.map((honor) => {
      return {
        code: honor.code,
        date: honor.createdAt,
        content: honor.content,
      };
    });
  }

  async findPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit; // Calculate how many records to skip

    // Fetch the data with pagination and total count
    const [blogs, total] = await this.blogsRepo.findAndCount({
      where: { deleted: false }, // Add any additional conditions here
      order: { createdAt: 'DESC' }, // Order by the most recent blogs
      skip: skip, // How many records to skip
      take: limit, // How many records to take (limit)
    });

    // Return the paginated results and meta information
    return {
      data: blogs,
      total: total,
      page: page,
      pageCount: Math.ceil(total / limit),
    };
  }



  async update(code: string, dto: UpdateBlogDto) {
    // Get existing blog first
    const existingBlog = await this.blogsRepo.findOne({ code: code }, true);
    if (!existingBlog) throw new NotFoundException(`Blog not found`);

    // Check if content changed and delete removed images
    if (dto.content && JSON.stringify(dto.content) !== JSON.stringify(existingBlog.content)) {
  
      const deletedImages = this.blogMediaHelper.findDeletedImages(
        existingBlog.content,
        dto.content
      );

      if (deletedImages.length > 0) {
        await this.mediaCleanup.deleteMultipleMedia(deletedImages);
      }
    }

    // Update the blog
    Object.assign(existingBlog, dto);
    await this.blogsRepo.createOrUpdate(existingBlog);

    return OK;
  }

  async delete(code: string) {
    console.log(`=== Deleting Blog: ${code} ===`);

    // Get the blog first
    const blog = await this.blogsRepo.findOne({ code: code }, true);
    if (!blog) throw new NotFoundException(`Blog not found`);

    // Delete all images from content
    let deletedCount = 0;
    if (blog.content) {
      deletedCount = await this.blogMediaHelper.deleteAllBlogImages(blog.content);
    }


    // Soft delete the blog
    blog.deleted = true;
    await this.blogsRepo.createOrUpdate(blog);

    return OK;
  }
}