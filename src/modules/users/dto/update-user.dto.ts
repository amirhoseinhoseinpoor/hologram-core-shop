import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

  @ApiProperty()  
  @IsOptional()  
  code?: string;  

  @ApiProperty()  
  @IsOptional()  
  firstName?: string;  

  @ApiProperty()  
  @IsOptional()  
  lastName?: string;  

  @ApiProperty()  
  @IsOptional()  
  username?: string;  

  @ApiProperty()  
  @IsBoolean()  
  @IsOptional()  
  active?: boolean; 

  @ApiProperty()  
  @IsBoolean()  
  @IsOptional()  
  domain?: number; 

  @ApiProperty({ type: [Number], required: false }) 
  @IsOptional()  
  roleIds?: number[];

}
