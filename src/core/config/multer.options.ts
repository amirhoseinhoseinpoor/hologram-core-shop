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
      const base = process.env.UPLOAD_LOCATION || './uploads';
      const isPublic =
        req.body?.isPublic === 'true' || req.body?.isPublic === true;
      const rawTag = req.body?.tag || 'misc';
      // Sanitize tag: remove path-unsafe chars, replace spaces with underscore.
      // Unicode characters (e.g. Persian) are intentionally kept.
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
