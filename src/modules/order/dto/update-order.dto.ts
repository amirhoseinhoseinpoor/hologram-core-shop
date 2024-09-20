import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateOrderDto) {
    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    active: boolean;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    deleted: boolean;
}
