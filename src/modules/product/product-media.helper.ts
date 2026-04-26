// src/modules/product/product-media.helper.ts
import { Injectable } from '@nestjs/common';
import { MediaCleanupService } from '../system/media-cleanup.service';

@Injectable()
export class ProductMediaHelper {
  constructor(private mediaCleanup: MediaCleanupService) {}

  /**
   * Extract all image/video filenames from product info JSON
   */
  extractFromInfo(info: any): string[] {
    const mediaFiles: string[] = [];
    
    if (!info) return mediaFiles;
    
    // Parse if info is a string
    let productInfo = info;
    if (typeof info === 'string') {
      try {
        productInfo = JSON.parse(info);
      } catch (e) {
        console.log('Info is not valid JSON');
        return mediaFiles;
      }
    }
    
    console.log('Extracting media from product info...');
    
    // 1. Extract from imgData array
    if (productInfo.imgData && Array.isArray(productInfo.imgData)) {
      productInfo.imgData.forEach((img: any) => {
        if (img.src && img.src.trim()) {
          mediaFiles.push(img.src);
          console.log(`  Found imgData.src: ${img.src}`);
        }
        if (img.poster && img.poster.trim()) {
          mediaFiles.push(img.poster);
          console.log(`  Found imgData.poster: ${img.poster}`);
        }
      });
    }
    
    // 2. Extract from header image if exists
    if (productInfo.src && typeof productInfo.src === 'string') {
      mediaFiles.push(productInfo.src);
      console.log(`  Found info.src: ${productInfo.src}`);
    }
    
    if (productInfo.imageSrc && typeof productInfo.imageSrc === 'string') {
      mediaFiles.push(productInfo.imageSrc);
      console.log(`  Found info.imageSrc: ${productInfo.imageSrc}`);
    }
    
    // 3. Extract from sections (if they contain images)
    if (productInfo.sections && Array.isArray(productInfo.sections)) {
      productInfo.sections.forEach((section: any) => {
        if (section.type === 'image' && section.items) {
          section.items.forEach((item: any) => {
            if (item.src && typeof item.src === 'string') {
              mediaFiles.push(item.src);
              console.log(`  Found section image: ${item.src}`);
            }
          });
        }
      });
    }
    
    // 4. Recursively search for any UUID patterns in the entire info object
    this.searchForUuidPatterns(productInfo, mediaFiles);
    
    return [...new Set(mediaFiles)]; // Remove duplicates
  }

  /**
   * Extract all media files from product media JSON array
   */
  extractFromMedia(media: any[]): string[] {
    const mediaFiles: string[] = [];
    
    if (!media || !Array.isArray(media)) return mediaFiles;
    
    console.log('Extracting media from product media array...');
    
    media.forEach((item: any, index: number) => {
      // Extract video source
      if (item.src && typeof item.src === 'string') {
        mediaFiles.push(item.src);
        console.log(`  Media[${index}].src: ${item.src}`);
      }
      
      // Extract poster image
      if (item.poster && typeof item.poster === 'string') {
        mediaFiles.push(item.poster);
        console.log(`  Media[${index}].poster: ${item.poster}`);
      }
    });
    
    return [...new Set(mediaFiles)];
  }

  /**
   * Extract ALL media files from product (both info and media)
   */
  extractAllProductMedia(info: any, media: any[]): string[] {
    const infoFiles = this.extractFromInfo(info);
    const mediaFiles = this.extractFromMedia(media);
    
    const allFiles = [...infoFiles, ...mediaFiles];
    const uniqueFiles = [...new Set(allFiles)];
    
    console.log(`\n=== Product Media Summary ===`);
    console.log(`Files from info: ${infoFiles.length}`);
    console.log(`Files from media array: ${mediaFiles.length}`);
    console.log(`Total unique files: ${uniqueFiles.length}`);
    
    if (uniqueFiles.length > 0) {
      console.log(`Files to delete:`);
      uniqueFiles.forEach(file => console.log(`  - ${file}`));
    }
    
    return uniqueFiles;
  }

  /**
   * Recursively search for UUID patterns in object
   */
  private searchForUuidPatterns(obj: any, foundFiles: string[], depth: number = 0) {
    if (!obj || typeof obj !== 'object' || depth > 10) return;
    
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    for (const key in obj) {
      const value = obj[key];
      
      if (typeof value === 'string' && uuidPattern.test(value)) {
        if (!foundFiles.includes(value)) {
          foundFiles.push(value);
          console.log(`  Found UUID in field "${key}": ${value}`);
        }
      } else if (typeof value === 'object' && value !== null) {
        this.searchForUuidPatterns(value, foundFiles, depth + 1);
      }
    }
  }

  /**
   * Delete all product media files
   */
  async deleteAllProductMedia(info: any, media: any[]): Promise<{ total: number; deleted: number }> {
    const mediaFiles = this.extractAllProductMedia(info, media);
    
    if (mediaFiles.length === 0) {
      console.log('No media files found in product');
      return { total: 0, deleted: 0 };
    }
    
    // Delete all media files
    const result = await this.mediaCleanup.deleteMultipleMedia(mediaFiles);
    
    return { total: mediaFiles.length, deleted: result.succeeded };
  }

  /**
   * Compare old and new product data to find files that need to be deleted
   */
  findDeletedFiles(oldInfo: any, oldMedia: any[], newInfo: any, newMedia: any[]): string[] {
    const oldFiles = this.extractAllProductMedia(oldInfo, oldMedia);
    const newFiles = this.extractAllProductMedia(newInfo, newMedia);
    
    // Find files that are in old but not in new
    const deletedFiles = oldFiles.filter(file => !newFiles.includes(file));
    
    if (deletedFiles.length > 0) {
      console.log(`Found ${deletedFiles.length} files to delete due to product update:`);
      deletedFiles.forEach(file => console.log(`  - ${file}`));
    }
    
    return deletedFiles;
  }
}