import { ApiProperty } from '@nestjs/swagger';

export class ProjectSamplingDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  total_cost: number;
}
