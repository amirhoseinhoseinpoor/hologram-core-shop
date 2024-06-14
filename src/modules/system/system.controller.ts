import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { SystemService } from './system.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/core/config/multer.options';
import { UploadDto } from './dto/upload-dto';

@Controller('system')
export class SystemController {
  constructor(private readonly sysService: SystemService) {}

  @Post('upload/:type')
  @UseInterceptors(FilesInterceptor('files', 20, multerOptions))
  uploadFile(@Param('type') type: string, @UploadedFiles() files: Array<Express.Multer.File>, ) {

    let dto = files.map((f) => ({ originalName: f.originalname, fileName: f.filename }) as UploadDto,);
   
    switch (+type) {
      case 1:
        this.sysService.uploadBanner(dto);
        break;

      default:
        break;
    }
    
  }
}
