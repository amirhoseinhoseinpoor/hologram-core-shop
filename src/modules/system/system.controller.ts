import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { SystemService } from './system.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/core/config/multer.options';
import { MediaDto } from './dto/media-dto';
import { MediaTypeDto } from './dto/media-type.dto';
import { Public } from 'src/core/decorator/public.decorator';

@Controller('system')
export class SystemController {
  constructor(private readonly sysService: SystemService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 20, multerOptions))
  uploadFile(
    @Body() info: MediaTypeDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    let dto = files.map(
      (f) =>
        ({ originalName: f.originalname, fileName: f.filename }) as MediaDto,
    );
    return this.sysService.uploadFiles(info, dto);
  }

  @Get('download/:filename')
  downloadFile(@Param('filename') filename: string) {
    return this.sysService.downloadFile(filename);
  }

  @Delete('media/:filename')
  removeMedia(@Param('filename') filename: string) {
    return this.sysService.removeFile(filename);
  }

  @Get('media/:tag')
  @Public()
  getPublicFiles(@Param('tag') tag: string) {
    return this.sysService.getPublicFiles(tag);
  }
}
