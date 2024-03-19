import { ApiProperty } from '@nestjs/swagger';

export class ProjectCostingVendorProductionDetailDto {
  @ApiProperty()
  vendor_id: number;

  @ApiProperty()
  vendor_name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  quantity_unit: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  total_price: number;

  @ApiProperty()
  price_unit: string;

  @ApiProperty()
  start_date: string;

  @ApiProperty()
  end_date: string;

  @ApiProperty()
  activity_id: number;

  @ApiProperty()
  activity_name: string;

  project_vendor_production_id: number;
  created_by?: number;
  created_at?: string;
}
