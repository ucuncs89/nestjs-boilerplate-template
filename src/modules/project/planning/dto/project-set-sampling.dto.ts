import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateProjectSetSamplingDto {
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

export class UpdateProjectSetSamplingDto extends PartialType(
  CreateProjectSetSamplingDto,
) {}

export class GetListProjectShippingDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;

  @ApiProperty({ required: false })
  order_by: string;

  @ApiProperty({ required: false })
  sort_by?: string;
}
