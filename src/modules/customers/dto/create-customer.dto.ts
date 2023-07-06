import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CustomerDocumentsDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  base_url: string;

  @ApiProperty()
  file_url: string;

  customer_id?: number;
}

export class CreateCustomerDto {
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

  @ApiProperty()
  @IsNotEmpty()
  pic_id_number: string;

  @ApiProperty()
  @IsNotEmpty()
  pic_phone_number: string;

  @ApiProperty()
  @IsNotEmpty()
  pic_email: string;

  @ApiProperty({
    isArray: true,
    type: CustomerDocumentsDto,
  })
  @ApiProperty()
  customer_documents: CustomerDocumentsDto[];
}
