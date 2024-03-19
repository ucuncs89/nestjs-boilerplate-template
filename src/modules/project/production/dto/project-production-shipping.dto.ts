import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export enum ProjectProductionShippingSendtoEnum {
  Vendor = 'Vendor',
  Buyer = 'Buyer',
}
export class ProjectProductionShippingDto {
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

  @ApiProperty()
  receipt_number?: string;

  @ApiProperty({ enum: ProjectProductionShippingSendtoEnum })
  send_to?: ProjectProductionShippingSendtoEnum;

  @ApiProperty()
  relation_name?: string;

  @ApiProperty()
  relation_id?: number;

  project_id?: number;

  created_by?: number;
  created_at?: string;
}
