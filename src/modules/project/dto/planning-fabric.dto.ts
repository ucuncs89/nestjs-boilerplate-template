import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class PlanningFabricDto {
  @ApiProperty()
  @IsNotEmpty()
  fabric_id: number;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  category: string;

  @ApiProperty()
  used_for: string;

  @ApiProperty()
  cut_shape: string;

  @IsNotEmpty()
  @ApiProperty()
  consumption: number;

  @IsNotEmpty()
  @ApiProperty()
  consumption_unit: string;

  @ApiProperty()
  heavy: number;

  @ApiProperty()
  heavy_unit: string;

  @ApiProperty()
  long: number;

  @ApiProperty()
  long_unit: string;

  @ApiProperty()
  wide: number;

  @ApiProperty()
  wide_unit: string;

  @ApiProperty()
  diameter: number;

  @ApiProperty()
  diameter_unit: string;

  project_planning_id?: number;
  created_by?: number;
  created_at?: string;
}

export class CreatePlanningFabricDto {
  @ApiProperty({
    isArray: true,
    type: PlanningFabricDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PlanningFabricDto)
  fabric?: PlanningFabricDto[];
}

export class UpdatePlanningFabricDto extends PartialType(PlanningFabricDto) {}

export class GetListPlanningFabricDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;

  @ApiProperty({ required: false })
  order_by: string;

  @ApiProperty({ required: false })
  sort_by?: string;
}
