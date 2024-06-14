import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { SystemService } from './system.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/core/config/multer.options';
import { UploadDto } from './dto/upload-dto';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 20, multerOptions))
  uploadFile(@Body() dto: UploadDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
    console.log('dto', dto)
  }

}
