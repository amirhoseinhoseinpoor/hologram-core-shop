// dto/find-user.dto.ts
import { 
  IsOptional, 
  IsNumber, 
  IsIn, 
  IsBoolean, 
  IsString, 
  Min, 
  IsEnum 
} from 'class-validator';
import { Type } from 'class-transformer';

export class FindUserDto {
  @IsOptional()
  id?: number;

  @IsOptional()
  code?: string;

  @IsOptional()
  nId?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @Type(() => Number) // Ensure domain is transformed to a number
  @IsNumber({}, { message: 'domain must be a number conforming to the specified constraints' })
  @IsIn([1, 2], { message: 'Domain must be either 1 or 2' })
  domain?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  // Optional: Pagination and Sorting
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'id';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'Sort order must be ASC or DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
