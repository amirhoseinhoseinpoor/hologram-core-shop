// src/modules/video/video-media.helper.ts
import { Injectable } from '@nestjs/common';
import { MediaCleanupService } from '../system/media-cleanup.service';

@Injectable()
export class VideoMediaHelper {
  constructor(private mediaCleanup: MediaCleanupService) {}

  /**
   * Extract all media files from video media JSON
   */
  extractFromMedia(media: any): string[] {
    const mediaFiles: string[] = [];
    
    if (!media) return mediaFiles;
    
    // Parse if media is a string
    let videoMedia = media;
    if (typeof media === 'string') {
      try {
        videoMedia = JSON.parse(media);
      } catch (e) {
        console.log('Media is not valid JSON');
        return mediaFiles;
      }
    }
    
    console.log('Extracting media from video...');
    
    // Extract video source
    if (videoMedia.src && typeof videoMedia.src === 'string') {
      mediaFiles.push(videoMedia.src);
      console.log(`  Found video src: ${videoMedia.src}`);
    }
    
    // Extract poster image
    if (videoMedia.poster && typeof videoMedia.poster === 'string') {
      mediaFiles.push(videoMedia.poster);
      console.log(`  Found video poster: ${videoMedia.poster}`);
    }
    
    return [...new Set(mediaFiles)]; // Remove duplicates
  }

  /**
   * Extract ALL media files from video
   */
  extractAllVideoMedia(media: any): string[] {
    const mediaFiles = this.extractFromMedia(media);
    
    console.log(`\n=== Video Media Summary ===`);
    console.log(`Total media files: ${mediaFiles.length}`);
    
    if (mediaFiles.length > 0) {
      console.log(`Files to delete:`);
      mediaFiles.forEach(file => console.log(`  - ${file}`));
    }
    
    return mediaFiles;
  }

  /**
   * Delete all video media files
   */
  async deleteAllVideoMedia(media: any): Promise<{ total: number; deleted: number }> {
    const mediaFiles = this.extractAllVideoMedia(media);
    
    if (mediaFiles.length === 0) {
      console.log('No media files found in video');
      return { total: 0, deleted: 0 };
    }
    
    // Delete all media files
    const result = await this.mediaCleanup.deleteMultipleMedia(mediaFiles);
    
    return { total: mediaFiles.length, deleted: result.succeeded };
  }

  /**
   * Compare old and new video data to find files that need to be deleted
   */
  findDeletedFiles(oldMedia: any, newMedia: any): string[] {
    const oldFiles = this.extractAllVideoMedia(oldMedia);
    const newFiles = this.extractAllVideoMedia(newMedia);
    
    // Find files that are in old but not in new
    const deletedFiles = oldFiles.filter(file => !newFiles.includes(file));
    
    if (deletedFiles.length > 0) {
      console.log(`Found ${deletedFiles.length} files to delete due to video update:`);
      deletedFiles.forEach(file => console.log(`  - ${file}`));
    }
    
    return deletedFiles;
  }
}