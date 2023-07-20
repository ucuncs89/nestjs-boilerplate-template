import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateActivityDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
