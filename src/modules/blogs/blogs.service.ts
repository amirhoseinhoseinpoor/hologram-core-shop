import { Injectable , NotFoundException } from '@nestjs/common';
import { Blogs } from 'src/core/db/entities/blogs.entity';
import { BlogsRepository } from './blogs.repository';
import { OK , genUID } from 'src/core/misc/consts';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {

    constructor(private repo: BlogsRepository) {}

    async create(dto: CreateBlogDto) {
        let code = genUID();
        await this.repo.createOrUpdate({
            ...dto,
            code: code,
            active: true,
            deleted: false,
        } as Blogs)
        return { code: code, ...OK }
    }

    async findOne(code: string) {
        const blogs = await this.repo.findOne({ code: code });
        if (!blogs) throw new NotFoundException(`Blogs not found`);
        return {
            code: blogs.code,
            content: blogs.content,
        };
    }

    async findAll() {
        const blogs = await this.repo.findAll();
        if (!blogs?.length) return [];
        return blogs.map((honor) => {
            return {
                code: honor.code,
                src: honor.src,
                content: honor.content,
            };
        });
    }

    async update(code: string, dto: UpdateBlogDto) {
        const blog = await this.repo.findOne({ code: code });
        if (!blog) throw new NotFoundException(`Blog not found`);
        Object.assign(blog, dto);
        await this.repo.createOrUpdate({ ...blog, code: code } as Blogs);
        return OK;
    }
    
}
