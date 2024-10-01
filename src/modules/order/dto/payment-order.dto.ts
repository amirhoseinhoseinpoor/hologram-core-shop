import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class PaymentOrderDto {
  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  payment: object;
}
