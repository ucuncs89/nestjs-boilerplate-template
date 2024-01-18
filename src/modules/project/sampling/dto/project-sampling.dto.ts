import { ApiProperty } from '@nestjs/swagger';

export class ProjectSamplingDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  cost: number;
}
