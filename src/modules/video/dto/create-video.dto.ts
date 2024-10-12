import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({ type: () => [Object] })
  @IsArray()
  @IsNotEmpty()
  media: object[];
}
