import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class ProjectVendorMaterialFinishedGoodDetailDto {
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

  project_vendor_material_finished_good_id?: number;
  created_by?: number;
  created_at?: string;
}
export class ProjectVendorMaterialFinishedGoodDto {
  @ApiProperty()
  project_variant_id: number;

  @ApiProperty({
    isArray: true,
    type: ProjectVendorMaterialFinishedGoodDetailDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProjectVendorMaterialFinishedGoodDetailDto)
  detail?: ProjectVendorMaterialFinishedGoodDetailDto[];

  project_detail_id?: number;
  created_by?: number;
  created_at?: string;
}

// export class UpdateProjectFabricDto extends PartialType(ProjectFabricDto) {}

export class GetListProjectVendorMaterialFinishedGoodDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;

  @ApiProperty({ required: false })
  order_by: string;

  @ApiProperty({ required: false })
  sort_by?: string;
}
