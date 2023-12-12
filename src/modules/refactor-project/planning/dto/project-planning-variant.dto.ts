import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class ProjectVariantFabricColorDto {
  project_variant_id?: number;

  @ApiProperty()
  color_id: number;

  @ApiProperty()
  color_name?: string;

  @ApiProperty()
  project_fabric_id: number;
}
export class ProjectVariantSizeDto {
  @IsNotEmpty()
  @ApiProperty()
  size_ratio: string;

  @IsNotEmpty()
  @ApiProperty()
  number_of_item: number;

  @ApiProperty({ required: false })
  size_unit?: string;

  project_variant_id?: number;
}
export class ProjectVariantDto {
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
    type: ProjectVariantFabricColorDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProjectVariantFabricColorDto)
  project_fabric?: ProjectVariantFabricColorDto[];

  @ApiProperty({
    isArray: true,
    type: ProjectVariantSizeDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProjectVariantSizeDto)
  size?: ProjectVariantSizeDto[];

  project_detail_id?: number;
  created_by?: number;
  created_at?: string;
}
