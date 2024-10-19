import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray } from 'class-validator';

export class CreateBannerDto {
    @ApiProperty({ type: () => [Object] })
    @IsNotEmpty()
    @IsArray()
    content: object[];
}
