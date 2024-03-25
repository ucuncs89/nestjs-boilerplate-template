import { ApiProperty } from '@nestjs/swagger';
import {
  InvoicePPHTypeEnum,
  InvoicePPNTypeEnum,
} from 'src/modules/invoice/dto/invoice.dto';

export class ProjectProformaInvoiceDto {
  @ApiProperty()
  total_dp: number;

  @ApiProperty()
  description: string;
}
