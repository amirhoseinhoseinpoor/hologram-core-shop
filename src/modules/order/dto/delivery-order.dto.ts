import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class DeliveryOrderDto {
  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  delivery: object;
}
