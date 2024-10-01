import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

export class ReqCommentOrderDto {
  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  reqComment: object;
}
