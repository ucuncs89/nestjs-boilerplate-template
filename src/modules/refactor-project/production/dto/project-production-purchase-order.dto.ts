import { ApiProperty } from '@nestjs/swagger';
export enum MaterialTypeProjectPurchaseOrderEnum {
  Fabric = 'Fabric',
  Sewing = 'Sewing',
  Packaging = 'Packaging',
  FinishedGoods = 'Finished goods',
}

export class ProjectProductionPurchaseOrderDto {
  @ApiProperty()
  vendor_id: number;

  @ApiProperty({ required: false, enum: MaterialTypeProjectPurchaseOrderEnum })
  material_type?: MaterialTypeProjectPurchaseOrderEnum;

  @ApiProperty()
  relation_id?: number;

  @ApiProperty()
  vendor_type: string;

  @ApiProperty()
  company_name: string;

  @ApiProperty()
  company_address: string;

  @ApiProperty()
  company_phone_number: string;

  @ApiProperty()
  ppn?: number;

  @ApiProperty()
  pph?: number;

  @ApiProperty()
  discount?: number;

  @ApiProperty()
  bank_name: string;

  @ApiProperty()
  bank_account_number: string;

  @ApiProperty()
  bank_account_houlders_name: string;

  @ApiProperty()
  notes: string;

  @ApiProperty()
  payment_term: string;

  created_by?: number;
  created_at?: string;
}
