import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  UseInterceptors,
  BadRequestException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserSiteDto } from './dto/update-userSite.dto';
import { TransactionInterceptor } from 'src/core/db/transaction.interceptor';
import { Provider } from 'src/core/decorator/provider.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseInterceptors(TransactionInterceptor)
  @Patch('editUserSite/:code')
  @ApiOperation({ summary: 'Update a user by code' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input or user not found.' })
  updateSite(@Param('code') code: string, @Body() dto: UpdateUserSiteDto) {
    return this.userService.update(code, dto);
  }

  @UseInterceptors(TransactionInterceptor)
  @Patch(':code')
  @Provider()
  @ApiOperation({ summary: 'Update a user by code' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input or user not found.' })
  update(@Param('code') code: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(code, dto);
  }

  



  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @ApiOperation({ summary: 'Find users based on provided criteria' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully.' })
  @ApiResponse({ status: 400, description: 'At least one field must be provided in the DTO.' })
  find(@Body() dto: FindUserDto) {
    if (!dto.id && !dto.code && !dto.nId && !dto.username && !dto.email) {
      throw new BadRequestException('At least one field must be provided in the DTO.');
    }
    return this.userService.findBy(dto);
  }

  @Get('allUser')
  @Provider()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @ApiOperation({ summary: 'Retrieve all users with optional domain filter' })
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters.' })
  findAll(@Query() dto: FindUserDto) {
    return this.userService.findBy(dto);
  }

  @UseInterceptors(TransactionInterceptor)
  @Delete(':code')
  @Provider()
  @ApiOperation({ summary: 'Remove a user by code' })
  @ApiResponse({ status: 200, description: 'User removed successfully.' })
  @ApiResponse({ status: 400, description: 'User not found.' })
  remove(@Param('code') code: string) {
    return this.userService.remove(code);
  }
}
