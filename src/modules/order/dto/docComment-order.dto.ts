import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class DocCommentOrderDto {
  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  docComment: object;
}
