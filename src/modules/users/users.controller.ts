import { Body, Controller, Delete, Get, Param, Patch, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransactionInterceptor } from 'src/core/db/transaction.interceptor';
import { FindUserDto } from './dto/find-user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseInterceptors(TransactionInterceptor)
  @Patch(':code')
  update(@Param('code') code: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(code, dto);
  }

  @Get()
  find(@Body() dto: FindUserDto) {
    return this.userService.findBy(dto);
  }

  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.userService.remove(code);
  }

}
