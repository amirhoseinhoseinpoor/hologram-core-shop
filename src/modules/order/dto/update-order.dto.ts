import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-order.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    active: boolean;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    deleted: boolean;
}
