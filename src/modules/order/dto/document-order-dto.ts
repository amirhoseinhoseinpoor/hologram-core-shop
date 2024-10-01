import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

export class DocumentOrderDto {
  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  document: object;
}
