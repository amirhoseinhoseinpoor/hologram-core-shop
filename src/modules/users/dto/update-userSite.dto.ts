import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserSiteDto extends PartialType(CreateUserDto) {

    @ApiProperty()
    @IsOptional()
    code?: string;

    @ApiProperty()
    @IsOptional()
    firstName?: string;

    @ApiProperty()
    @IsOptional()
    lastName?: string;

    @ApiProperty()
    @IsOptional()
    email: string;

    @ApiProperty()
    @IsOptional()
    gender?: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    active?: boolean;
}
