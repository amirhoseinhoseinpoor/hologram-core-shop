import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class CreateBannerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: String;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  src: String;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  link: String;

}
