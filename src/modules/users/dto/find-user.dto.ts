import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class FindUserDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  nId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  username: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  @IsNotEmpty()
  email: string;
}
