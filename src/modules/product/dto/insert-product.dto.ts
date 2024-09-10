import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class InsertProductDto {
    @ApiProperty()
    @IsString()
    @MinLength(8, { message: 'product title must have at least 8 characters.' })
    @MaxLength(150, { message: 'product title  must have maximum 150 characters.' })
    @IsOptional()
    title: string;

    @ApiProperty()
    @IsObject()
    @IsOptional()
    info: object;

    @ApiProperty({ type: () => [Object] })
    @IsArray()
    @IsOptional()
    media?: object[];
}