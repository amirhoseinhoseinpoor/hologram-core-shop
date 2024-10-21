import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray } from 'class-validator';

export class UpdateHeaderDto {
    @ApiProperty({ type: () => [Object] })
    @IsNotEmpty()
    @IsArray()
    content: object[];
}
