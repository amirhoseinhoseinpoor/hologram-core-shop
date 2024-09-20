import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    deleted: boolean;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    paid: boolean;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    finish: boolean;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    type: number;
}
