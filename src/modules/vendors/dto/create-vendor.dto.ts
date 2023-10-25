import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum TypeVendorDocumentsEnum {
  SPPKP = 'SPPKP',
  NPWP = 'NPWP',
  KTP = 'KTP',
}

export class VendorDocumentsDto {
  @ApiProperty({ enum: TypeVendorDocumentsEnum })
  @IsEnum(TypeVendorDocumentsEnum)
  type: TypeVendorDocumentsEnum;

  @ApiProperty()
  base_url: string;

  @ApiProperty()
  file_url: string;

  vendor_id?: number;
}

export class VendorTypeDto {
  @ApiProperty()
  name: string;

  vendor_id?: number;
}

export class CreateVendorDto {
  @ApiProperty()
  @IsNotEmpty()
  company_name: string;

  @ApiProperty()
  @IsNotEmpty()
  company_phone_number: string;

  @ApiProperty()
  @IsNotEmpty()
  company_address: string;

  @ApiProperty()
  @IsNotEmpty()
  taxable: string;

  @ApiProperty()
  @IsNotEmpty()
  pic_full_name: string;

  @ApiProperty({ required: false })
  pic_id_number?: string;

  @ApiProperty()
  @IsNotEmpty()
  pic_phone_number: string;

  @ApiProperty()
  pic_email?: string;

  @ApiProperty({
    isArray: true,
    type: VendorDocumentsDto,
  })
  @ApiProperty()
  vendor_documents?: VendorDocumentsDto[];

  @ApiProperty({
    isArray: true,
    type: VendorTypeDto,
  })
  @ApiProperty()
  vendor_type?: VendorTypeDto[];

  @ApiProperty()
  npwp_number?: string;

  @ApiProperty()
  bank_name?: string;

  @ApiProperty()
  bank_account_number?: string;

  @ApiProperty()
  bank_account_holder_name?: string;

  @ApiProperty()
  city_id?: number;

  @ApiProperty()
  province_id?: number;

  status?: string;

  is_active?: boolean;
}
