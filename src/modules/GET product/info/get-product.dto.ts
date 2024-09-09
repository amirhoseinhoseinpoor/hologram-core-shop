import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, IsOptional, IsString } from "class-validator";

export class GetProductDto {

    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    title: string;

}