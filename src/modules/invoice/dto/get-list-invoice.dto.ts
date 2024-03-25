import { ApiProperty } from '@nestjs/swagger';
import { InvoiceTypeEnum } from './invoice.dto';

export class GetListInvoiceDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;

  @ApiProperty({ required: false })
  order_by: string;

  @ApiProperty({ required: false })
  sort_by?: string;

  @ApiProperty({ required: false })
  keyword?: string;

  @ApiProperty({ required: false, enum: InvoiceTypeEnum })
  type?: InvoiceTypeEnum;

  @ApiProperty({ required: false })
  start_date?: string;

  @ApiProperty({ required: false })
  end_date?: string;

  project_id?: number;
}
