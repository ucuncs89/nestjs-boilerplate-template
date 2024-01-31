import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export enum ProjectMaterialItemEnum {
  Fabric = 'Fabric',
  Sewing = 'Sewing',
  Packaging = 'Packaging',
  Finishedgoods = 'Finished goods',
}

export class GetListProjectMaterialDto {
  @ApiProperty({ required: false, enum: ProjectMaterialItemEnum })
  type?: ProjectMaterialItemEnum;
}

export class ProjectMaterialItemDto {
  @ApiProperty()
  @IsNotEmpty()
  relation_id: number;

  @ApiProperty({ enum: ProjectMaterialItemEnum })
  type: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  category: string;

  @ApiProperty()
  used_for?: string;

  @ApiProperty()
  cut_shape?: string;

  @ApiProperty()
  allowance: number;

  @IsNotEmpty()
  @ApiProperty()
  consumption: number;

  @IsNotEmpty()
  @ApiProperty()
  consumption_unit: string;

  @ApiProperty()
  width: number;

  @ApiProperty()
  width_unit: string;

  @ApiProperty()
  long: number;

  @ApiProperty()
  long_unit: string;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  weight_unit: string;

  @ApiProperty()
  length: number;

  @ApiProperty()
  length_unit: string;

  @ApiProperty()
  diameter: number;

  @ApiProperty()
  diameter_unit: string;

  project_id?: number;

  created_by?: number;
  created_at?: string;
}
