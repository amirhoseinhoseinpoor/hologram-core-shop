import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class RequestOrderDto {
  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  request: object;
}
