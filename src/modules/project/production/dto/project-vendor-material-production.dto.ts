import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class ProjectVendorMaterialProductionDetailDto {
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
export class ProjectVendorMaterialProductionDto {
  @ApiProperty()
  project_variant_id: number;

  @ApiProperty()
  project_fabric_id: number;

  @ApiProperty({
    isArray: true,
    type: ProjectVendorMaterialProductionDetailDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProjectVendorMaterialProductionDetailDto)
  detail?: ProjectVendorMaterialProductionDetailDto[];

  project_detail_id?: number;
  created_by?: number;
  created_at?: string;
}
