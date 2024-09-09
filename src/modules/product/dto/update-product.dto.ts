import { ApiProperty, PartialType } from '@nestjs/swagger';
import { InsertProductDto } from './insert-product.dto';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    IsBoolean,
  } from 'class-validator';

export class UpdateUserDto extends PartialType(InsertProductDto) {
    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    @IsOptional()
    active: boolean;

    @ApiProperty()
    @IsString()
    @MinLength(8, { message: 'product title must have at least 8 characters.' })
    @MaxLength(150, { message: 'product title  must have maximum 150 characters.' })
    @IsOptional()
    title: string;
}