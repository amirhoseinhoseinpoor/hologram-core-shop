import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateHonorDto } from './create-honor.dto';

export class UpdateHonorDto extends PartialType(CreateHonorDto) {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  active: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  deleted: boolean;
}
