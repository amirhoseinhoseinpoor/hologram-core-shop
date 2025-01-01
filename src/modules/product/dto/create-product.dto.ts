import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  navId : number;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  info: object;

  @ApiProperty({ type: () => [Object] })
  @IsArray()
  media?: object[];
}
