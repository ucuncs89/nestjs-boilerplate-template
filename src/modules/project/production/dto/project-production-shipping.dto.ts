import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class ProjectProductionShippingDto {
  @ApiProperty()
  shipping_name: string;

  @ApiProperty()
  shipping_vendor_name: string;

  @ApiProperty()
  @IsDateString()
  shipping_date: string;

  @ApiProperty()
  shipping_cost?: number;

  @ApiProperty()
  receipt_number?: string;

  project_id?: number;

  created_by?: number;
  created_at?: string;
}
