import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  @MinLength(4, { message: 'Name must have at least 4 characters.' })
  @IsNotEmpty()
  name: string;
}
