// src/modules/blogs/blog-media.helper.ts
import { Injectable } from '@nestjs/common';
import { MediaCleanupService } from '../system/media-cleanup.service';

@Injectable()
export class BlogMediaHelper {
  constructor(private mediaCleanup: MediaCleanupService) {}

  /**
   * Extract all image filenames from blog JSON content
   */
  extractImagesFromBlogContent(content: any): string[] {
    const images: string[] = [];
    
    if (!content) return images;
    
    // Parse if content is a string
    let blogData = content;
    if (typeof content === 'string') {
      try {
        blogData = JSON.parse(content);
      } catch (e) {
        // If not JSON, try to extract from HTML
        return this.extractImagesFromHtml(content);
      }
    }
    
    console.log('Extracting images from blog JSON:', Object.keys(blogData));
    
    // 1. Check for imageSrc field (main blog image)
    if (blogData.imageSrc && typeof blogData.imageSrc === 'string') {
      images.push(blogData.imageSrc);
    }
    
    // 2. Check for src field
    if (blogData.src && typeof blogData.src === 'string') {
      images.push(blogData.src);
    }
    
    // 3. Check product object for src
    if (blogData.product && blogData.product.src) {
      images.push(blogData.product.src);
    }
    
    // 4. Check product object for imageSrc
    if (blogData.product && blogData.product.imageSrc) {
      images.push(blogData.product.imageSrc);
    }
    
    // 5. Extract images from HTML content field
    if (blogData.content && typeof blogData.content === 'string') {
      const htmlImages = this.extractImagesFromHtml(blogData.content);
      images.push(...htmlImages);
    }
    
    // 6. Check for imgData array (if exists)
    if (blogData.imgData && Array.isArray(blogData.imgData)) {
      blogData.imgData.forEach((img: any) => {
        if (img.src) images.push(img.src);
        if (img.poster) images.push(img.poster);
      });
    }
    
    // 7. Check for media array (if exists)
    if (blogData.media && Array.isArray(blogData.media)) {
      blogData.media.forEach((item: any) => {
        if (item.src) images.push(item.src);
        if (item.poster) images.push(item.poster);
      });
    }
    
    // 8. Recursively search for any field that might contain image UUIDs
    const searchForImages = (obj: any, depth: number = 0) => {
      if (!obj || typeof obj !== 'object' || depth > 5) return;
      
      for (const key in obj) {
        const value = obj[key];
        
        // Check if value is a string that looks like a UUID image filename
        if (typeof value === 'string') {
          const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|gif|webp|mp4)$/i;
          if (uuidPattern.test(value)) {
            if (!images.includes(value)) {
              images.push(value);
              console.log(`  Found image in field "${key}": ${value}`);
            }
          }
        }
        // Recursively search nested objects
        else if (typeof value === 'object' && value !== null) {
          searchForImages(value, depth + 1);
        }
      }
    };
    
    searchForImages(blogData);
    
    // Remove duplicates
    const uniqueImages = [...new Set(images)];
    console.log(`Total unique images found: ${uniqueImages.length}`);
    
    return uniqueImages;
  }

  /**
   * Extract image filenames from HTML string
   */
  private extractImagesFromHtml(html: string): string[] {
    const images: string[] = [];
    if (!html || typeof html !== 'string') return images;
    
    // Match src attributes in img tags
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      const src = match[1];
      const filename = this.extractFilenameFromUrl(src);
      if (filename && this.isImageFile(filename)) {
        images.push(filename);
      }
    }
    
    // Match background-image urls
    const bgRegex = /background-image:\s*url\(["']?([^"')]+)["']?\)/gi;
    while ((match = bgRegex.exec(html)) !== null) {
      const src = match[1];
      const filename = this.extractFilenameFromUrl(src);
      if (filename && this.isImageFile(filename)) {
        images.push(filename);
      }
    }
    
    return [...new Set(images)];
  }

  /**
   * Extract filename from URL
   */
  private extractFilenameFromUrl(url: string): string | null {
    if (!url) return null;
    
    // Remove query parameters
    const cleanUrl = url.split('?')[0].split('#')[0];
    
    // Extract filename from URL
    const parts = cleanUrl.split('/');
    let filename = parts[parts.length - 1];
    
    // Check if it's a UUID format (our system's file naming)
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|gif|webp|mp4)$/i;
    if (uuidPattern.test(filename)) {
      return filename;
    }
    
    // Check if it's any image file
    if (this.isImageFile(filename)) {
      return filename;
    }
    
    return null;
  }

  /**
   * Check if filename is an image file
   */
  private isImageFile(filename: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(filename);
  }

  /**
   * Delete all images found in blog content
   */
  async deleteAllBlogImages(content: any): Promise<number> {
    const images = this.extractImagesFromBlogContent(content);
    
    if (images.length === 0) {
      console.log('No images found in blog content');
      return 0;
    }
    
    console.log(`Found ${images.length} images to delete from blog:`);
    images.forEach(img => console.log(`  - ${img}`));
    
    // Delete all images
    await this.mediaCleanup.deleteMultipleMedia(images);
    
    return images.length;
  }

  /**
   * Compare old and new content to find images that need to be deleted
   */
  findDeletedImages(oldContent: any, newContent: any): string[] {
    const oldImages = this.extractImagesFromBlogContent(oldContent);
    const newImages = this.extractImagesFromBlogContent(newContent);
    
    // Find images that are in old but not in new
    const deletedImages = oldImages.filter(img => !newImages.includes(img));
    
    if (deletedImages.length > 0) {
      console.log(`Found ${deletedImages.length} images to delete due to content update:`);
      deletedImages.forEach(img => console.log(`  - ${img}`));
    }
    
    return deletedImages;
  }
}