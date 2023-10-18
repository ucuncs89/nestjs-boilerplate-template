import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class ProjectPriceAdditionalDto {
  @ApiProperty()
  additional_name: string;

  @ApiProperty()
  additional_price: number;

  @ApiProperty()
  description: string;

  project_price_id?: number;
  created_by?: number;
  created_at?: string;
}
export class ProjectPriceDto {
  @ApiProperty()
  selling_price_per_item: number;

  @ApiProperty()
  loss_percentage: number;

  @ApiProperty({
    isArray: true,
    type: ProjectPriceAdditionalDto,
  })
  // @IsNotEmpty()
  // @ValidateNested({ each: true })
  @Type(() => ProjectPriceAdditionalDto)
  additional_price?: ProjectPriceAdditionalDto[];

  project_detail_id?: number;
  created_by?: number;
  created_at?: string;
}

// export class UpdateProjectFabricDto extends PartialType(ProjectFabricDto) {}

// export class GetListProjectVendorMaterialFabricDto {
//   @ApiProperty({ required: false })
//   page: number;

//   @ApiProperty({ required: false })
//   page_size: number;

//   @ApiProperty({ required: false })
//   order_by: string;

//   @ApiProperty({ required: false })
//   sort_by?: string;
// }
