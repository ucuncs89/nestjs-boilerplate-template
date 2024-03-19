import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ProjectPlanningSamplingDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  total_cost: number;
}
