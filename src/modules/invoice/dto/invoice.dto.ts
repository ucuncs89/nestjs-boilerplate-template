import { ApiProperty } from '@nestjs/swagger';

export class InvoiceDto {
  company_name: string;
  customer_id: number;

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

  // @ApiProperty()
  project_id: number;
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
  CreatedByThe = 'Created by the production team',
  SendByThe = 'Sent by the finance team',
  PaymentStatusConfirm = 'Payment status is confirmed by the finance team',
}

export class InvoiceDetailDto {
  invoice_id?: number;

  item: string;

  quantity: number;

  unit: string;

  unit_price: number;

  sub_total: number;
}
