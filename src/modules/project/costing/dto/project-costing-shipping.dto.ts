import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class ProjectCostingShippingDto {
  @ApiProperty()
  shipping_name: string;

  @ApiProperty()
  shipping_vendor_name: string;

  @ApiProperty()
  @IsDateString()
  shipping_date: string;

  @ApiProperty()
  @IsNotEmpty()
  total_shipping_cost: number;

  project_id?: number;

  created_by?: number;
  created_at?: string;
}
