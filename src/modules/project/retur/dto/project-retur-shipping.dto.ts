import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export enum ProjectReturShippingSendtoEnum {
  Vendor = 'Vendor',
  Buyer = 'Buyer',
}
export class ProjectReturShippingDto {
  @ApiProperty()
  shipping_name: string;

  @ApiProperty()
  shipping_vendor_name: string;

  @ApiProperty()
  @IsDateString()
  shipping_date: string;

  @ApiProperty()
  total_shipping_cost?: number;

  @ApiProperty()
  receipt_number?: string;

  @ApiProperty({ enum: ProjectReturShippingSendtoEnum })
  send_to?: ProjectReturShippingSendtoEnum;

  @ApiProperty()
  relation_name?: string;

  @ApiProperty()
  relation_id?: number;

  project_id?: number;

  created_by?: number;
  created_at?: string;
}
