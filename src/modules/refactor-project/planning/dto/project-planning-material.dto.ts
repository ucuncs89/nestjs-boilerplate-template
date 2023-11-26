import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProjectMaterialSourceDto {
  @ApiProperty()
  @IsNotEmpty()
  material_source: string;
}
export class CreateProjectMaterialOtherDto {
  @ApiProperty()
  fabric_percentage_of_loss: number;

  @ApiProperty()
  sewing_accessories_percentage_of_loss: number;

  @ApiProperty()
  packaging_accessories_percentage_of_loss: number;

  @ApiProperty()
  finished_goods_percentage_of_loss: number;

  @ApiProperty()
  packaging_instructions: string;
}
export enum ProjectMaterialItemEnum {
  Fabric = 'Fabric',
  Sewing = 'Sewing',
  Packaging = 'Packaging',
  Finishedgoods = 'Finished goods',
}
export class ProjectMaterialItemDto {
  @ApiProperty()
  @IsNotEmpty()
  relation_id: number;

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

  project_detail_id?: number;

  created_by?: number;
  created_at?: string;

  @ApiProperty({ enum: ProjectMaterialItemEnum })
  type: ProjectMaterialItemEnum;
}
export class GetListProjectMaterialDto {
  @ApiProperty({ required: false, enum: ProjectMaterialItemEnum })
  type: ProjectMaterialItemEnum;
}
