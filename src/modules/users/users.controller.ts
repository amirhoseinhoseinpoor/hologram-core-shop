import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransactionInterceptor } from 'src/core/db/transaction.interceptor';
import { FindUserDto } from './dto/find-user.dto';
import { Provider } from 'src/core/decorator/provider.decorator';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseInterceptors(TransactionInterceptor)
  @Patch(':code')
  update(@Param('code') code: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(code, dto);
  }

  @Get()
  find(@Query() dto: FindUserDto) {
    return this.userService.findBy(dto);
  }

  @UseInterceptors(TransactionInterceptor)
  @Delete(':code')
  @Provider()
  remove(@Param('code') code: string) {
    return this.userService.remove(code);
  }
}
