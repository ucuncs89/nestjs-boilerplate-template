import { ApiProperty } from '@nestjs/swagger';

export class ProjectPlanningPriceAdditionalDto {
  @ApiProperty()
  additional_name: string;

  @ApiProperty()
  additional_price: number;

  @ApiProperty()
  description: string;

  project_price_id?: number;
  created_by?: number;
  created_at?: string;
}
export class ProjectPlanningPriceDto {
  @ApiProperty()
  selling_price_per_item: number;

  @ApiProperty()
  loss_percentage: number;

  project_detail_id?: number;
  created_by?: number;
  created_at?: string;
}
