import { ApiProperty, PartialType } from '@nestjs/swagger';
import { InsertProductDto } from './insert-product.dto';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsBoolean,
    IsNumber,
  } from 'class-validator';

export class UpdateUserDto extends PartialType(InsertProductDto) {
    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    @IsOptional()
    active: boolean;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    id: number;
}