import { ApiProperty } from '@nestjs/swagger';

export enum PurchaseOrderTypeEnum {
  Material = 'Material',
  Production = 'Production',
}

export enum PurchaseOrderPPNTypeEnum {
  Non_PPN = 'Non-PPN',
  PPN = 'PPN',
}
export enum PurchaseOrderPPHTypeEnum {
  Non_PPH = 'Non-PPH',
  PPH_23 = 'PPH 23',
  PPH_4_2 = 'PPH 4(2)',
}

export class PurchaseOrderDto {
  company_name: string;
  vendor_id: number;

  @ApiProperty()
  company_address?: string;

  @ApiProperty()
  company_phone_number?: string;

  @ApiProperty({ enum: PurchaseOrderPPNTypeEnum })
  ppn_type: PurchaseOrderPPNTypeEnum;

  @ApiProperty()
  ppn?: number;

  @ApiProperty({ enum: PurchaseOrderPPHTypeEnum })
  pph_type: PurchaseOrderPPHTypeEnum;

  @ApiProperty()
  discount?: number;

  @ApiProperty()
  bank_name: string;

  @ApiProperty()
  bank_account_houlders_name?: string;

  @ApiProperty()
  bank_account_number?: string;

  @ApiProperty()
  payment_term?: number;

  @ApiProperty()
  notes?: string;

  // @ApiProperty()
  type: PurchaseOrderTypeEnum;

  // @ApiProperty()
  pph?: number;
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
  RequestByTheProduction = 'Requested by the production team',
  CreatedByTheFinance = 'Created by the finance team',
}

export enum PurchaseOrderStatusPaymentEnum {
  Approved = 'Approved',
  Waiting = 'Waiting',
  Rejected = 'Rejected',
  Cancel = 'Cancel',
}
export enum PurchaseOrderStatusReceiveEnum {
  Approved = 'Approved',
  Waiting = 'Waiting',
  Rejected = 'Rejected',
  Cancel = 'Cancel',
}
export class PurchaseOrderStatusPaymentDto {
  @ApiProperty({ enum: PurchaseOrderStatusPaymentEnum })
  status_payment: PurchaseOrderStatusPaymentEnum;
}
export class PurchaseOrderStatusReceiveDto {
  @ApiProperty({ enum: PurchaseOrderStatusReceiveEnum })
  status_receive: PurchaseOrderStatusReceiveEnum;
}
