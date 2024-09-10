import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class GetProductDto {

    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    id: number;
}