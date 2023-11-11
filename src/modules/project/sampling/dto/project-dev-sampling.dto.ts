import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ProjectDevSamplingDto {
  @ApiProperty()
  sampling_date?: string;
  @ApiProperty()
  sampling_price?: number;
  @ApiProperty()
  is_completed: boolean;
}
export class ProjectSamplingRevisiDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  description: string;
}
