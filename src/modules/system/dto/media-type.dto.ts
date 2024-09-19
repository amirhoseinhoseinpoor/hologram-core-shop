import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class MediaTypeDto {
  @ApiProperty({ description: 'Unique Key' })
  tag: string;

  @ApiProperty({
    default: 1,
    description: 'File extension type => 1: image, 2: video, ... , 9: other',
  })
  @IsNumber()
  @Min(1)
  @Max(10)
  type: number = 1;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isPublic: boolean = false;
}
