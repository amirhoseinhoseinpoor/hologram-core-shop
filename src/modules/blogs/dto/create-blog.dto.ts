import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  src: String;

  @ApiProperty({ type: () => [Object] })
  @IsNotEmpty()
  @IsArray()
  content: Object[];
}
