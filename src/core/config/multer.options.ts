import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';

export const multerOptions = {
  // Enable file size limits
  // limits: {
  //   fileSize: +process.env.MAX_FILE_SIZE,
  // },

  fileFilter: (req: any, file: any, cb: any) => {  
    // Get the extension of the file  
    const fileExtension = extname(file.originalname).toLowerCase();  

    if (/\.jpg|\.jpeg|\.png|\.gif|\.mp4|\.rar|\.pdf|\.zip$/.test(fileExtension)) {  
        cb(null, true); // Accept the file  
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
      const uploadPath = process.env.UPLOAD_LOCATION;
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    filename: (req: any, file: any, cb: any) => {
      cb(null, `${uuid()}`);
      // cb(null, `${uuid()}${extname(file.originalname)}`);
    },
  }),
};
