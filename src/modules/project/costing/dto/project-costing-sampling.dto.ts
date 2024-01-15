import { ApiProperty } from '@nestjs/swagger';

export class ProjectCostingSamplingDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  cost: number;
}
