import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class ProjectAccessoriesPackagingDto {
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

  project_material_id?: number;
  created_by?: number;
  created_at?: string;
}

export class CreateProjectAccessoriesPackagingDto {
  @ApiProperty({
    isArray: true,
    type: ProjectAccessoriesPackagingDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProjectAccessoriesPackagingDto)
  accessories_packaging?: ProjectAccessoriesPackagingDto[];
}

export class UpdateProjectAccessoriesPackagingDto extends PartialType(
  ProjectAccessoriesPackagingDto,
) {}

export class GetListPProjectAccessoriesPackagingDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;

  @ApiProperty({ required: false })
  order_by: string;

  @ApiProperty({ required: false })
  sort_by?: string;
}
