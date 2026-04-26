// src/modules/base/base-media-entity.service.ts
import { NotFoundException } from '@nestjs/common';
import { MediaCleanupService } from '../system/media-cleanup.service';
import { OK } from 'src/core/misc/consts';
export abstract class BaseMediaEntityService<T> {
    constructor(
        protected repo: any,
        protected mediaCleanup: MediaCleanupService,
    ) { }

    async deleteWithMedia(code: string, mediaField: string = 'src') {

        const entity = await this.repo.findOne({ code: code }, true);
        if (!entity) {
            throw new NotFoundException(`Entity not found`);
        }

        // Delete associated media (only if not already deleted)
        if (entity[mediaField] && !entity.deleted) {
            await this.mediaCleanup.deleteMediaByFileName(entity[mediaField]);
        } else if (entity.deleted) {
            console.log(`⚠️ Entity already deleted, skipping media deletion`);
        } else {
            console.log(`⚠️ No media found in field "${mediaField}"`);
        }

        // If not already deleted, soft delete it
        if (!entity.deleted) {
            console.log(`🗑️ Soft deleting entity...`);
            entity.deleted = true;
            await this.repo.createOrUpdate(entity);
        } else {
            console.log(`ℹ️ Entity was already deleted`);
        }

        return OK;
    }

    async updateWithMedia(
        code: string,
        dto: any,
        mediaField: string = 'src',
        updateData: any
    ) {
        const entity = await this.repo.findOne({ code: code });
        if (!entity) throw new NotFoundException(`Entity not found`);

        // If media is being replaced, delete the old one
        if (dto[mediaField] && dto[mediaField] !== entity[mediaField] && entity[mediaField]) {
            this.mediaCleanup.deleteMediaByFileName(entity[mediaField]);
        }

        Object.assign(entity, updateData);
        await this.repo.createOrUpdate(entity);

        return OK;
    }

    async restoreWithMedia(code: string) {
        const entity = await this.repo.findOne({ code: code, deleted: true });
        if (!entity) throw new NotFoundException(`Entity not found`);

        entity.deleted = false;
        await this.repo.createOrUpdate(entity);

        return OK;
    }
}