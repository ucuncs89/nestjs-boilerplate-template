import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class PlanningPackagingDto {
  @ApiProperty()
  @IsNotEmpty()
  accessories_packaging_id: number;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  category: string;

  @IsNotEmpty()
  @ApiProperty()
  consumption: number;

  @IsNotEmpty()
  @ApiProperty()
  consumption_unit: string;

  project_planning_id?: number;
  created_by?: number;
  created_at?: string;
}

export class CreatePlanningPackagingDto {
  @ApiProperty({
    isArray: true,
    type: PlanningPackagingDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PlanningPackagingDto)
  accessories_packaging?: PlanningPackagingDto[];
}

export class UpdatePlanningPackagingDto extends PartialType(
  PlanningPackagingDto,
) {}

export class GetListPlanningPackagingDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;

  @ApiProperty({ required: false })
  order_by: string;

  @ApiProperty({ required: false })
  sort_by?: string;
}
