import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ProjectCostingSamplingDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  total_cost: number;
}
