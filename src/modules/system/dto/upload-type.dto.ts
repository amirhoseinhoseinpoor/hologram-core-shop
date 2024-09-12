import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class UploadTypeDto {
    @ApiProperty()
    tag: string;  

    @ApiProperty()
    @IsNumber()
    type: number;
  }
  