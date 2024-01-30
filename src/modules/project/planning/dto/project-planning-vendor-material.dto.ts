import { ApiProperty } from '@nestjs/swagger';

export class ProjectPlanningVendorMaterialDto {
  @ApiProperty()
  vendor_id: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  quantity_unit: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  price_unit: string;

  @ApiProperty()
  total_price: number;

  @ApiProperty()
  type: string;

  created_by?: number;
  created_at?: string;
}
