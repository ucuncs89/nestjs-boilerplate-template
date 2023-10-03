import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class ProjectAccessoriesSewingDTO {
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

  project_material_id?: number;
  created_by?: number;
  created_at?: string;
}

export class CreateProjectAccessoriesSewingDto {
  @ApiProperty({
    isArray: true,
    type: ProjectAccessoriesSewingDTO,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProjectAccessoriesSewingDTO)
  accessories_sewing?: ProjectAccessoriesSewingDTO[];
}

export class UpdateProjectAccessoriesSewingDto extends PartialType(
  ProjectAccessoriesSewingDTO,
) {}

export class GetListProjectAccessoriesSewingDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;

  @ApiProperty({ required: false })
  order_by: string;

  @ApiProperty({ required: false })
  sort_by?: string;
}
