import { ApiProperty } from '@nestjs/swagger';

export enum PurchaseOrderTypeEnum {
  Material = 'Material',
  Production = 'Production',
}

export class PurchaseOrderDto {
  company_name: string;
  vendor_id: number;

  @ApiProperty()
  company_address?: string;

  @ApiProperty()
  company_phone_number?: string;

  @ApiProperty()
  ppn?: number;

  @ApiProperty()
  pph?: number;

  @ApiProperty()
  discount?: number;

  @ApiProperty()
  bank_name: string;

  @ApiProperty()
  bank_account_houlders_name?: string;

  @ApiProperty()
  bank_account_number?: string;

  @ApiProperty()
  payment_term?: string;

  @ApiProperty()
  notes?: string;

  @ApiProperty()
  type: PurchaseOrderTypeEnum;

  // @ApiProperty()
  project_id: number;
}
export enum StatusPurchaseOrderEnum {
  Approved = 'Approved',
  Waiting = 'Waiting',
  Rejected = 'Rejected',
}
export class PurchaseApprovalDto {
  @ApiProperty({ required: false, enum: StatusPurchaseOrderEnum })
  status?: StatusPurchaseOrderEnum;

  @ApiProperty({ required: false })
  reason?: string;
}

export enum PurchaseOrderStatusEnum {
  CreatedByThe = 'Created by the production team',
  SendByThe = 'Sent by the finance team',
  PaymentStatusConfirm = 'Payment status is confirmed by the finance team',
}
