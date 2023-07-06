import { ApiProperty } from '@nestjs/swagger';

export enum StatusCustomerEnum {
  valid = 'Validated',
  invalid = 'Not yet validated',
}
export enum TaxableCustomerEnum {
  pkp = 'PKP',
  nonpkp = 'Non PKP',
}

export class GetListCustomersDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;

  @ApiProperty({ required: false })
  order_by: string;

  @ApiProperty({ required: false })
  sort_by?: string;

  @ApiProperty({ required: false, enum: StatusCustomerEnum })
  status?: StatusCustomerEnum;

  @ApiProperty({ required: false, enum: TaxableCustomerEnum })
  taxable?: TaxableCustomerEnum;

  @ApiProperty({ required: false })
  keyword?: string;
}
