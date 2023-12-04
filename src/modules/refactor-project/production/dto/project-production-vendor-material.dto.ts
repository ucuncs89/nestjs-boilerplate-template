import { ApiProperty } from '@nestjs/swagger';
import { ProjectMaterialItemEnum } from '../../planning/dto/project-planning-material.dto';

export class ProjectProductionVendorMaterialDto {
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
export class GetListProjectProductionVendorMaterialDto {
  @ApiProperty({ required: false, enum: ProjectMaterialItemEnum })
  type: ProjectMaterialItemEnum;
}
