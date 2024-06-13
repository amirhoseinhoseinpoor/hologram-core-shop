import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SystemService } from './system.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/core/config/multer.options';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
  

}
