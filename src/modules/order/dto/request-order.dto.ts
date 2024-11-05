import { ApiProperty } from '@nestjs/swagger';
import { isNotEmpty, IsNotEmpty, IsObject, IsOptional , IsString } from 'class-validator';

export class RequestOrderDto {
  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  request: object;

  @ApiProperty()
  @IsString()
  prodName: string;
}
