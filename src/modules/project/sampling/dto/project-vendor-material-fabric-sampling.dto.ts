import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class ProjectVendorMaterialSamplingDetailDto {
  @ApiProperty()
  vendor_id: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  quantity_unit: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  price_unit: string;

  @ApiProperty()
  total_price: number;

  @ApiProperty()
  type: string;

  created_by?: number;
  created_at?: string;
}
export class ProjectVendorMaterialFabricSamplingDto {
  @ApiProperty()
  project_variant_id: number;

  @ApiProperty()
  project_fabric_id: number;

  @ApiProperty({
    isArray: true,
    type: ProjectVendorMaterialSamplingDetailDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProjectVendorMaterialSamplingDetailDto)
  detail?: ProjectVendorMaterialSamplingDetailDto[];

  project_detail_id?: number;
  created_by?: number;
  created_at?: string;
}
