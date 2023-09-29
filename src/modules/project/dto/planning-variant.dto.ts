import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class PlanningVariantFabricColorDto {
  project_planning_variant_id?: number;

  @ApiProperty()
  color_id: number;

  @ApiProperty({ required: false })
  color_name?: string;

  @ApiProperty()
  project_planning_fabric_id: number;
}
export class PlanningVariantSizeDto {
  @IsNotEmpty()
  @ApiProperty()
  size_ratio: string;

  @IsNotEmpty()
  @ApiProperty()
  number_of_item: number;

  @ApiProperty({ required: false })
  size_unit?: string;

  project_planning_variant_id?: number;
}
export class PlanningVariantDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  total_item: number;

  @IsNotEmpty()
  @ApiProperty()
  item_unit: string;

  @ApiProperty({
    isArray: true,
    type: PlanningVariantFabricColorDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PlanningVariantFabricColorDto)
  project_fabric?: PlanningVariantFabricColorDto[];

  @ApiProperty({
    isArray: true,
    type: PlanningVariantSizeDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PlanningVariantSizeDto)
  size?: PlanningVariantSizeDto[];

  project_planning_id?: number;
  created_by?: number;
  created_at?: string;
}

export class CreatePlanningVariantDto {
  @ApiProperty({
    isArray: true,
    type: PlanningVariantDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PlanningVariantDto)
  variant?: PlanningVariantDto[];
}

export class UpdatePlanningVariantDtoDto extends PartialType(
  PlanningVariantDto,
) {}

export class GetListPlanningVariantDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;

  @ApiProperty({ required: false })
  order_by: string;

  @ApiProperty({ required: false })
  sort_by?: string;
}
