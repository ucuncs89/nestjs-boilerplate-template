import { ApiProperty } from '@nestjs/swagger';

export class ProjectProductionInvoiceDto {
  @ApiProperty()
  customer_id: number;

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
