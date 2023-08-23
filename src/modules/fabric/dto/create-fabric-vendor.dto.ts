import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class FabricVendorColorDto {
  @IsNotEmpty()
  @ApiProperty()
  color_name: string;

  @IsNotEmpty()
  @ApiProperty()
  color_code: string;

  fabric_vendor_id?: number;
}

export class FabricFilesColorDto {
  @ApiProperty()
  base_url: string;

  @ApiProperty()
  file_url: string;

  fabric_vendor_id?: number;
}
export enum StockAvailableFabricVendorEnum {
  not_available = 'Not available',
  available = 'Available',
}
export class CreateFabricVendorDto {
  @ApiProperty()
  @IsNotEmpty()
  vendor_id: number;

  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  weight: string;

  @ApiProperty()
  @IsNotEmpty()
  width: string;

  @ApiProperty()
  @IsNotEmpty()
  minimum_order_quantity: string;

  @ApiProperty({ required: false, enum: StockAvailableFabricVendorEnum })
  @IsNotEmpty()
  @IsEnum(StockAvailableFabricVendorEnum)
  stock_availability: StockAvailableFabricVendorEnum;

  @ApiProperty({
    isArray: true,
    type: FabricVendorColorDto,
  })
  @ApiProperty()
  color?: FabricVendorColorDto[];

  @ApiProperty({
    isArray: true,
    type: FabricFilesColorDto,
  })
  @ApiProperty()
  files?: FabricFilesColorDto[];
}
