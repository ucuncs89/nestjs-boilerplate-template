import { ApiProperty } from '@nestjs/swagger';

export class ProjectShippingProductionDto {
  @ApiProperty()
  shipping_name: string;

  @ApiProperty()
  shipping_vendor_name: string;

  @ApiProperty()
  shipping_date: string;

  @ApiProperty()
  shipping_cost?: number;

  project_detail_id?: number;

  created_by?: number;
  created_at?: string;
}
