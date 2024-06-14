import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class UploadTypeDto {
    @ApiProperty()
    @IsNumber()
    type: number;  

    @ApiProperty()
    @IsNumber()
    flag: number;
  }
  