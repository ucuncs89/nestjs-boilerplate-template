import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateProjectPlanningSetSamplingDto {
  @ApiProperty()
  is_sampling: boolean;

  @ApiProperty()
  sampling_date: string;

  @ApiProperty()
  sampling_price: number;

  project_detail_id?: number;

  created_by?: number;
  created_at?: string;
}

export class UpdateProjectPlanningSetSamplingDto extends PartialType(
  CreateProjectPlanningSetSamplingDto,
) {}
