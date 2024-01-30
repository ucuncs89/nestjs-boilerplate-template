import { ApiProperty } from '@nestjs/swagger';

export class ProjectPlanningSamplingDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  cost: number;
}
