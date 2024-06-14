import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { SystemService } from './system.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/core/config/multer.options';
import { UploadDto } from './dto/upload-dto';
import { TransactionInterceptor } from 'src/core/db/transaction.interceptor';
import { UploadTypeDto } from './dto/upload-type.dto';
import { OK } from 'src/core/misc/consts';

@Controller('system')
export class SystemController {
  constructor(private readonly sysService: SystemService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 20, multerOptions))
  uploadFile(@Body() info: UploadTypeDto, @UploadedFiles() files: Array<Express.Multer.File>, ) {
    let dto = files.map((f) => ({ originalName: f.originalname, fileName: f.filename }) as UploadDto,);
    switch (+info.type) {
      case 1:
        this.sysService.uploadBanner(+info.flag, dto);
        break;
      default:
        break;
    }    
    return OK;
  }

  @Get('download/:filename')
  dowloadFile(@Param('filename') filename: string) {
      return this.sysService.readFile(filename);
    }

  @Get('landing')
  landingData(){
    return this.sysService.landingData();
  }

}
