import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class ProjectPlanningVendorProductionDetailDto {
  @ApiProperty()
  vendor_id: number;

  @ApiProperty()
  vendor_name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  quantity_unit: string;

  @ApiProperty()
  price: number;

  created_by?: number;
  created_at?: string;
}
export class ProjectPlanningVendorProductionDto {
  @ApiProperty()
  activity_id: number;

  @ApiProperty()
  activity_name: string;

  @ApiProperty()
  percentage_of_loss: number;

  @ApiProperty()
  total_quantity: number;

  // @ApiProperty({
  //   isArray: true,
  //   type: ProjectVendorProductionDetailDto,
  // })
  // @IsNotEmpty()
  // @ValidateNested({ each: true })
  // @Type(() => ProjectVendorProductionDetailDto)
  // detail?: ProjectVendorProductionDetailDto[];

  quantity_unit_required?: number;

  sub_total_price?: number;

  project_detail_id?: number;
  created_by?: number;
  created_at?: string;
}

// export class UpdateProjectFabricDto extends PartialType(ProjectFabricDto) {}

export class GetListProjectVendorMaterialFabricDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;

  @ApiProperty({ required: false })
  order_by: string;

  @ApiProperty({ required: false })
  sort_by?: string;
}
export class ProjectPlanningVendorProductionLossPercentageDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  percentage_of_loss: number;

  project_detail_id?: number;
  created_by?: number;
  created_at?: string;
}

export class ProjectPlanningVendorProductionLossDto {
  @ApiProperty({
    isArray: true,
    type: ProjectPlanningVendorProductionLossPercentageDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProjectPlanningVendorProductionLossPercentageDto)
  vendor?: ProjectPlanningVendorProductionLossPercentageDto[];
}
