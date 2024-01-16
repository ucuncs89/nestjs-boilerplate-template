import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class ProjectVariantSizeDto {
  @IsNotEmpty()
  @ApiProperty()
  size_ratio: string;

  @IsNotEmpty()
  @ApiProperty()
  number_of_item: number;

  @ApiProperty({ required: false })
  size_unit?: string;

  @ApiProperty()
  size_id: number;

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
    type: ProjectVariantSizeDto,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProjectVariantSizeDto)
  size?: ProjectVariantSizeDto[];

  project_id?: number;
  created_by?: number;
  created_at?: string;
}
