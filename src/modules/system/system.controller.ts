import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { SystemService } from './system.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/core/config/multer.options';
import { MediaDto } from './dto/media-dto';
import { MediaTypeDto } from './dto/media-type.dto';
import { Public } from 'src/core/decorator/public.decorator';

@Controller('system')
export class SystemController {
  constructor(private readonly sysService: SystemService) { }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 20, multerOptions))
  uploadFile(
    @Req() req: Request,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    // Extract from req.body (multer populates this)
    const info: MediaTypeDto = {
      tag: req.body?.tag || 'misc',
      type: parseInt(req.body?.type) || 1,
      isPublic: req.body?.isPublic === 'true' || req.body?.isPublic === true,
    };

    console.log('Upload info:', info);
    
    const dto = files.map(
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
