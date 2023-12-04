import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class ProjectProductionVendorProductionDetailDto {
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
export class ProjectProductionVendorProductionDto {
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
export class ProjectProductionVendorProductionLossPercentageDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  percentage_of_loss: number;

  project_detail_id?: number;
  created_by?: number;
  created_at?: string;
}

export class ProjectProductionVendorProductionLossDto {
  @ApiProperty({
    isArray: true,
    type: ProjectProductionVendorProductionLossPercentageDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProjectProductionVendorProductionLossPercentageDto)
  vendor?: ProjectProductionVendorProductionLossPercentageDto[];
}

export class ProjectProductionVendorProductionDetailDueDateDto {
  @ApiProperty()
  production_due_date?: string;
}
