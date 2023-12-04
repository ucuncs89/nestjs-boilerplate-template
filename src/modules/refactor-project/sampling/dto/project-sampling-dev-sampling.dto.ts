import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ProjectSamplingDevSamplingDto {
  @ApiProperty()
  sampling_date?: string;
  @ApiProperty()
  sampling_price?: number;
  @ApiProperty()
  is_completed: boolean;
}
export class ProjectSamplingSamplingRevisiDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  description: string;
}
