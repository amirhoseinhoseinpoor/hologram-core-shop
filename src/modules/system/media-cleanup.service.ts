// src/modules/system/media-cleanup.service.ts
import { Injectable } from '@nestjs/common';
import { SystemService } from './system.service';

@Injectable()
export class MediaCleanupService {
  constructor(private systemService: SystemService) {}

  async deleteMediaByFileName(fileName: string, isPublic: boolean = true) {
    console.log('=== MediaCleanupService.deleteMediaByFileName ===');
    console.log('fileName:', fileName);
    console.log('isPublic:', isPublic);
    
    if (!fileName) {
      console.log('No fileName provided, skipping');
      return { success: false, reason: 'No fileName' };
    }
    
    try {
      const result = await this.systemService.removeFile(fileName);
      console.log('SystemService.removeFile result:', result);
      return { success: true, result };
    } catch (error) {
      console.error(`Failed to delete media ${fileName}:`, error);
      return { success: false, error: error.message };
    }
  }

  async deleteMultipleMedia(fileNames: string[]): Promise<{ succeeded: number; failed: number }> {
    const validFileNames = fileNames.filter(f => f && typeof f === 'string');
    if (validFileNames.length === 0) {
      return { succeeded: 0, failed: 0 };
    }
    
    console.log(`Batch deleting ${validFileNames.length} media files`);
    
    const results = await Promise.allSettled(
      validFileNames.map(fileName => 
        this.deleteMediaByFileName(fileName)
      )
    );
    
    const succeeded = results.filter(r => r.status === 'fulfilled' && r.value?.success !== false).length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    console.log(`Batch delete completed: ${succeeded} succeeded, ${failed} failed`);
    
    return { succeeded, failed };
  }
}