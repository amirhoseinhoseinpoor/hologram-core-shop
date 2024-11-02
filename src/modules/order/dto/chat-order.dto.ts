import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray } from 'class-validator';

export class ChatOrderDto {
  @ApiProperty({ type: () => [Object] })
  @IsArray()
  chat?: object[];
}
