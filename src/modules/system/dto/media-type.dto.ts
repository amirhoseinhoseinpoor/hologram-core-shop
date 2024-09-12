import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class MediaTypeDto {
    @ApiProperty()
    tag: string;  

    @ApiProperty()
    @IsNumber()
    type: number;
  }
  