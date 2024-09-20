import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsObject, IsString } from "class-validator";
import { User } from "src/core/db/entities/user.entity";

export class CreateOrderDto {
    // @ApiProperty()
    // @IsString()
    // @IsNotEmpty()
    // name: string;

    // @ApiProperty()
    // @IsObject()
    // @IsNotEmpty()
    // owner: User;

    @ApiProperty()
    @IsObject()
    @IsNotEmpty()
    info: object;

    @ApiProperty({ type: () => [Object] })
    @IsArray()
    product?: object[];
}
