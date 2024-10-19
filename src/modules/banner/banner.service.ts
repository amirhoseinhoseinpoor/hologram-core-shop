import { Injectable, NotFoundException } from '@nestjs/common';
import { Banner } from 'src/core/db/entities/banner.entity';
import { OK, genUID } from 'src/core/misc/consts';
import { BannerRepository } from './banner.repository';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { CreateBannerDto } from './dto/create-banner.dto';


@Injectable()
export class BannerService {
    constructor(private repo: BannerRepository) { }

    async create(dto: CreateBannerDto) {
        let code = genUID();
        await this.repo.createOrUpdate({
            ...dto,
            code: code,
            active: true,
            deleted: false,
        } as Banner);
        return { code: code, ...OK };
    }

    async findOne(code: string) {
        const honor = await this.repo.findOne({ code: code });
        if (!honor) throw new NotFoundException(`banner not found`);
        return {
            code: honor.code,
            title: honor.title,
            src: honor.src,
            link: honor.link,
        };
    }

    async findAll() {
        const honors = await this.repo.findAll();
        if (!honors?.length) return [];
        return honors.map((honor) => {
            return {
                code: honor.code,
                title: honor.title,
                date: honor.createdAt,
                src: honor.src,
                link: honor.link,
            };
        });
    }

    async update(code: string, dto: UpdateBannerDto) {
        const honor = await this.repo.findOne({ code: code });
        if (!honor) throw new NotFoundException(`Banner not found`);
        Object.assign(honor, dto);
        await this.repo.createOrUpdate({ ...honor, code: code } as Banner);
        return OK;
    }

}
