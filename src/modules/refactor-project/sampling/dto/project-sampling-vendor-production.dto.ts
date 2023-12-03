import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class ProjectSamplingVendorProductionDetailDto {
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
export class ProjectSamplingVendorProductionDto {
  @ApiProperty()
  activity_id: number;

  @ApiProperty()
  activity_name: string;

  @ApiProperty()
  percentage_of_loss: number;

  @ApiProperty()
  total_quantity: number;

  quantity_unit_required?: number;

  sub_total_price?: number;

  project_detail_id?: number;
  created_by?: number;
  created_at?: string;
}

export class ProjectSamplingVendorProductionLossPercentageDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  percentage_of_loss: number;

  project_detail_id?: number;
  created_by?: number;
  created_at?: string;
}

export class ProjectSamplingVendorProductionLossDto {
  @ApiProperty({
    isArray: true,
    type: ProjectSamplingVendorProductionLossPercentageDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProjectSamplingVendorProductionLossPercentageDto)
  vendor?: ProjectSamplingVendorProductionLossPercentageDto[];
}
