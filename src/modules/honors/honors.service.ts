import { Injectable, NotFoundException } from '@nestjs/common';
import { Honors } from 'src/core/db/entities/honors.entity';
import { CreateHonorDto } from './dto/create-honor.dto';
import { OK, genUID } from 'src/core/misc/consts';
import { HonorsRepository } from './honors.repository';
import { UpdateHonorDto } from './dto/update-honor.dto';


@Injectable()
export class HonorsService {
    constructor(private repo: HonorsRepository) { }

    async create(dto: CreateHonorDto) {
        let code = genUID();
        await this.repo.createOrUpdate({
            ...dto,
            code: code,
            active: true,
            deleted: false,
        } as Honors)
        return { code: code, ...OK }
    }

    async findOne(code: string) {
        const honor = await this.repo.findOne({ code: code });
        if (!honor) throw new NotFoundException(`Honor not found`);
        return {
            code: honor.code,
            title: honor.title,
            content: honor.content,
        };
    }

    async findAll() {
        const honors = await this.repo.findAll();
        if (!honors?.length) return [];
        return honors.map((honor) => {
            return {
                code: honor.code,
                title: honor.title,
                content: honor.content,
            };
        });
    }

    async update(code: string, dto: UpdateHonorDto) {
        const honor = await this.repo.findOne({ code: code });
        if (!honor) throw new NotFoundException(`Honor not found`);
        Object.assign(honor, dto);
        await this.repo.createOrUpdate({ ...honor, code: code } as Honors);
        return OK;
    }


}