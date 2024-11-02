import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransactionInterceptor } from 'src/core/db/transaction.interceptor';
import { FindUserDto } from './dto/find-user.dto';
import { Provider } from 'src/core/decorator/provider.decorator';
import { Admin } from 'src/core/decorator/admin.decorator';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseInterceptors(TransactionInterceptor)
  @Patch(':code')
  update(@Param('code') code: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(code, dto);
  }


  @Post()
  @UsePipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }))
  find(@Body() dto: FindUserDto) {
    // if (!dto.id && !dto.code && !dto.nId && !dto.username && !dto.email) {  
    //   throw new BadRequestException('At least one field must be provided in the DTO.');  
    // }  
    return this.userService.findBy(dto);
  }

  @UseInterceptors(TransactionInterceptor)
  @Delete(':code')
  @Provider()
  remove(@Param('code') code: string) {
    return this.userService.remove(code);
  }
}
