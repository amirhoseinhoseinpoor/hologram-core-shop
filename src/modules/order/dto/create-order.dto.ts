import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { User } from "src/core/db/entities/user.entity";

export class CreateOrderDto {
    @ApiProperty()
    @IsObject()
    @IsOptional()
    request: object;

    @ApiProperty()
    @IsObject()
    @IsOptional()
    reqComment: object;
  
    @ApiProperty()
    @IsObject()
    @IsOptional()
    document: object;
  
    @ApiProperty()
    @IsObject()
    @IsOptional()
    docComment: object;
  
    @ApiProperty()
    @IsObject()
    @IsOptional()
    chat: object;
  
    @ApiProperty()
    @IsObject()
    @IsOptional()
    delivery: object;
  
    @ApiProperty()
    @IsObject()
    @IsOptional()
    payment: object;
  }
