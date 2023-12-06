import { ApiProperty } from '@nestjs/swagger';

export class PurchaseOrderDto {
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
}
export enum StatusApprovalEnum {
  Approved = 'Approved',
  Rejected = 'Rejected',
}
export class ProjectApprovalDto {
  @ApiProperty({ required: false, enum: StatusApprovalEnum })
  status?: StatusApprovalEnum;
}
