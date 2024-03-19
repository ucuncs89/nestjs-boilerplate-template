import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ProjectSamplingDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  total_cost: number;
}
