import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(8, { message: 'National ID must have at least 8 characters.' })
  @MaxLength(10, { message: 'National ID must have maximum 10 characters.' })
  @IsOptional()
  nId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(4, { message: 'First name must have at least 4 characters.' })
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(4, { message: 'Last name must have at least 4 characters.' })
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4, { message: 'Username must have at least 4 characters.' })
  username: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEnum(['f', 'm', 'u'])
  gender?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 4,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message: `Password must contain Minimum 4 and maximum 20 characters,
      at least one uppercase letter,
      one lowercase letter,
      one number and
      one special character`,
    },
  )
  password: string;

  @ApiProperty({ type: () => [Number] })
  @IsArray()
  @IsOptional()
  roleIds: number[];
}
