import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class PlanningSewingDto {
  @ApiProperty()
  @IsNotEmpty()
  accessories_sewing_id: number;

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

export class CreatePlanningSewingDto {
  @ApiProperty({
    isArray: true,
    type: PlanningSewingDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PlanningSewingDto)
  accessories_sewing?: PlanningSewingDto[];
}

export class UpdatePlanningSewingDto extends PartialType(PlanningSewingDto) {}

export class GetListPlanningSewingDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;

  @ApiProperty({ required: false })
  order_by: string;

  @ApiProperty({ required: false })
  sort_by?: string;
}
