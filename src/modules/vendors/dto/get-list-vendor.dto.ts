import { ApiProperty } from '@nestjs/swagger';

export enum StatusVendorEnum {
  valid = 'Validated',
  invalid = 'Not yet validated',
}
export enum TaxableVendorEnum {
  pkp = 'PKP',
  nonpkp = 'Non PKP',
}

export enum StatusActiveEnum {
  true = 'true',
  false = 'false',
}

export class GetListVendorsDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;

  @ApiProperty({ required: false })
  order_by: string;

  @ApiProperty({ required: false })
  sort_by?: string;

  @ApiProperty({ required: false, enum: StatusVendorEnum })
  status?: StatusVendorEnum;

  @ApiProperty({ required: false, enum: TaxableVendorEnum })
  taxable?: TaxableVendorEnum;

  @ApiProperty({ required: false })
  keyword?: string;

  @ApiProperty({ required: false })
  type?: string;

  @ApiProperty({ required: false, enum: StatusActiveEnum })
  is_active?: StatusActiveEnum;

  @ApiProperty({ required: false })
  province_id?: number;

  @ApiProperty({ required: false })
  city_id?: number;
}
