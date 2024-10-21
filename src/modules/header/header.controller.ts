import {
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Body,
    Delete,
} from '@nestjs/common';
import { HeaderService } from './header.service';
import { UpdateHeaderDto } from './dto/update-header.dto';
import { Public } from 'src/core/decorator/public.decorator';
import { Provider } from 'src/core/decorator/provider.decorator';


@Controller('header')
export class HeaderController { 
    constructor(private readonly headerService: HeaderService) {}

    @Post()
    // @Provider()
    create(@Body() dto: UpdateHeaderDto) {
      return this.headerService.create(dto);
    }

    @Get('find')
    @Public()
    findOne() {
      return this.headerService.findOne();
    }
  
    @Patch()
    // @Provider()
    update(@Body() dto: UpdateHeaderDto) {
      return this.headerService.update(dto);
    }
  
}
