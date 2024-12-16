import { ApiProperty } from '@nestjs/swagger';

export class CountOrderDto {
  @ApiProperty({ description: 'تعداد سفارش‌ها' })
  count: number;
}