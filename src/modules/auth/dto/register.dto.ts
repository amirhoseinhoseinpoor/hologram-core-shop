import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterDto extends CreateUserDto {
  @ApiProperty()
  @IsString()
  otp: string;
}
