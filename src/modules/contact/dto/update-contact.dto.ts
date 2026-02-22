import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateContactDto } from './create-contact.dto';

export class UpdateContactDto extends PartialType(CreateContactDto) {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  deleted?: boolean;
}
