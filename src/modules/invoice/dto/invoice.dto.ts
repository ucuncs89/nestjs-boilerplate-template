import { ApiProperty } from '@nestjs/swagger';
export enum InvoiceTypeEnum {
  proforma = 'proforma',
  retur = 'retur',
  purchase = 'purchase',
}
export enum InvoicePPNTypeEnum {
  Non_PPN = 'Non-PPN',
  PPN = 'PPN',
}
export enum InvoicePPHTypeEnum {
  Non_PPH = 'Non-PPH',
  PPH_23 = 'PPH 23',
  PPH_4_2 = 'PPH 4(2)',
}
export class InvoiceDto {
  company_name: string;
  customer_id: number;

  @ApiProperty()
  company_address?: string;

  @ApiProperty()
  company_phone_number?: string;

  @ApiProperty({ enum: InvoicePPNTypeEnum })
  ppn_type: InvoicePPNTypeEnum;

  @ApiProperty()
  ppn?: number;

  @ApiProperty({ enum: InvoicePPHTypeEnum })
  pph_type: InvoicePPHTypeEnum;

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

  type: InvoiceTypeEnum;

  // @ApiProperty()
  pph?: number;
  project_id: number;

  retur_id?: number;
}
export enum StatusInvoiceEnum {
  Approved = 'Approved',
  Waiting = 'Waiting',
  Rejected = 'Rejected',
}
export class InvoiceApprovalDto {
  @ApiProperty({ required: false, enum: StatusInvoiceEnum })
  status?: StatusInvoiceEnum;

  @ApiProperty({ required: false })
  reason?: string;
}

export enum InvoiceStatusEnum {
  RequestByTheProduction = 'Requested by the production team',
  CreatedByTheFinance = 'Created by the finance team',
}

export class InvoiceDetailDto {
  invoice_id?: number;

  item: string;

  quantity: number;

  unit: string;

  unit_price: number;

  sub_total: number;
}
