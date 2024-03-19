import { ApiProperty } from '@nestjs/swagger';

export class ProjectPlanningSamplingDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  total_cost: number;
}
