import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateBlogDto } from './create-blog.dto';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    active: boolean;
  
    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    deleted: boolean;
  }
  