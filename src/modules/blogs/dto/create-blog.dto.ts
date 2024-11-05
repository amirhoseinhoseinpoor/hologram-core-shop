import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsBoolean } from 'class-validator';

export class CreateBlogDto {
  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // title: String;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // src: String;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // tags: String;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // type: String;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsBoolean()
  // priority: boolean;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // time: String;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsArray()
  // content: String;

  @ApiProperty({ type: () => [Object] })
  @IsArray()
  @IsNotEmpty()
  content: object[];
}
