import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty , IsString, IsArray } from "class-validator";

export class CreateHonorDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title : String;

  @ApiProperty({ type: () => [Object] })
  @IsNotEmpty()
  @IsArray()
  content : Object[]
}