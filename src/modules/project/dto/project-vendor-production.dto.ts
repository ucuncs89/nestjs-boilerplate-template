import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class ProjectVendorProductionDetailDto {
  @ApiProperty()
  vendor_id: number;

  @ApiProperty()
  vendor_name: string;

  @ApiProperty()
  activity_id: number;

  @ApiProperty()
  activity_name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  quantity_unit: string;

  @ApiProperty()
  price: number;

  project_vendor_production_id?: number;
  created_by?: number;
  created_at?: string;
}
export class ProjectVendorProductionDto {
  @ApiProperty()
  sewing_percentage_of_loss: number;

  @ApiProperty()
  cutting_percentage_of_loss: number;

  @ApiProperty({
    isArray: true,
    type: ProjectVendorProductionDetailDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProjectVendorProductionDetailDto)
  detail?: ProjectVendorProductionDetailDto[];

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
