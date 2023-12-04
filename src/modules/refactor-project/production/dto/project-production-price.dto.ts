import { ApiProperty } from '@nestjs/swagger';

export class ProjectProductionPriceCostDto {
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
