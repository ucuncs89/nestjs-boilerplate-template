import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class ProjectFabricDto {
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

  project_material_id?: number;
  created_by?: number;
  created_at?: string;

  @ApiProperty({ required: false })
  method_type: string;

  @ApiProperty({ required: false })
  id: number;
}

export class CreateProjectFabricDto {
  @ApiProperty({
    isArray: true,
    type: ProjectFabricDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProjectFabricDto)
  fabric?: ProjectFabricDto[];
}

export class UpdateProjectFabricDto extends PartialType(ProjectFabricDto) {}

export class GetListProjectFabricDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;

  @ApiProperty({ required: false })
  order_by: string;

  @ApiProperty({ required: false })
  sort_by?: string;
}
