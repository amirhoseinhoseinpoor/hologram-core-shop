import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateVideoDto } from './create-video.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateVideoDto extends PartialType(CreateVideoDto) {
    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    active: boolean;
  
    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    deleted: boolean;
  }
  