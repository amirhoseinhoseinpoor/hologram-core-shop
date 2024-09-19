import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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

  @Post('download/list/:tag')
  getFiles(@Param('tag') tag: string) {
    return this.sysService.getFiles(tag);
  }

  @Post('download/:filename')
  getFile(@Param('filename') filename: string) {
    return this.sysService.getFile(filename);
  }


  @Get('download/list/:tag')
  @Public()
  getPublicFiles(@Param('tag') tag: string) {
    return this.sysService.getPublicFiles(tag);
  }

  @Get('download/:filename')
  @Public()
  getPublicFile(@Param('filename') filename: string) {
    return this.sysService.getPublicFile(filename);
  }

  @Delete('download/:filename')
  removeFile(@Param('filename') filename: string) {
    return this.sysService.removeFile(filename);
  }
}
