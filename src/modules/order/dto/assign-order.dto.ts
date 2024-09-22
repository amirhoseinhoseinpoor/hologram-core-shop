import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AssignOrderDto {
  
  @ApiProperty({ description: 'Tracking code of the order to be assigned' })
  @IsString()
  tracking: string;

  @ApiProperty({ description: 'Current user ID (from whom the order is being reassigned)' })
  @IsString()
  from: string;

  @ApiProperty({ description: 'New user ID (to whom the order is being assigned)' })
  @IsString()
  to: string;
}
