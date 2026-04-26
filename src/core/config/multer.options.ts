// multer.options.ts
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';

export const multerOptions = {
  fileFilter: (req: any, file: any, cb: any) => {
    const fileExtension = extname(file.originalname).toLowerCase();

    if (/\.jpg|\.jpeg|\.png|\.gif|\.mp4|\.rar|\.pdf|\.zip$/.test(fileExtension)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Unsupported file type ${fileExtension}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      // At this point, req.body should be populated if fields were sent BEFORE files
      // The order in FormData matters: fields MUST come before files
      
      const base = process.env.UPLOAD_LOCATION || './uploads';
      
      // Log to debug
      console.log('Destination - req.body:', req.body);
      
      const isPublic = req.body?.isPublic === 'true' || req.body?.isPublic === true;
      const rawTag = req.body?.tag || 'misc';
      const tag = rawTag.replace(/[/\\:*?"<>|]/g, '_').replace(/\s+/g, '_');
      const visibility = isPublic ? 'public' : 'private';
      const uploadPath = join(base, visibility, tag);
      
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req: any, file: any, cb: any) => {
      const ext = extname(file.originalname).toLowerCase();
      cb(null, `${uuid()}${ext}`);
    },
  }),
};