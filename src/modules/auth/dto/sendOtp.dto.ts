import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsIn, IsString } from 'class-validator';

export class SendOtpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsIn(['login', 'register'])
  type: 'login' | 'register';
}
