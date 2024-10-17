import { Injectable, NotFoundException } from '@nestjs/common';
import { Blogs } from 'src/core/db/entities/blogs.entity';
import { BlogsRepository } from './blogs.repository';
import { OK, genUID } from 'src/core/misc/consts';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(private repo: BlogsRepository) { }

  async create(dto: CreateBlogDto) {
    let code = genUID();
    await this.repo.createOrUpdate({
      ...dto,
      code: code,
      active: true,
      deleted: false,
    } as Blogs);
    return { code: code, ...OK };
  }

  async findOne(code: string) {
    const blogs = await this.repo.findOne({ code: code });
    if (!blogs) throw new NotFoundException(`Blogs not found`);
    return {
      code: blogs.code,
      date: blogs.createdAt,
      content: blogs.content,
    };
  }

  async findAll() {
    const blogs = await this.repo.findAll();
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
    const skip = (page - 1) * limit;  // Calculate how many records to skip
  
    // Fetch the data with pagination and total count
    const [blogs, total] = await this.repo.findAndCount({
      where: { deleted: false },  // Add any additional conditions here
      order: { createdAt: 'DESC' },  // Order by the most recent blogs
      skip: skip,  // How many records to skip
      take: limit,  // How many records to take (limit)
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
    const blog = await this.repo.findOne({ code: code });
    if (!blog) throw new NotFoundException(`Blog not found`);
    Object.assign(blog, dto);
    await this.repo.createOrUpdate({ ...blog, code: code } as Blogs);
    return OK;
  }
}
