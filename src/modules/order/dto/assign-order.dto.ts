import { ApiProperty } from "@nestjs/swagger";


export class AssignOrderDto {
    tracking: string;
    from: string;
    to: string;
  }
  