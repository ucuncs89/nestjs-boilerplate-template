import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class ProjectProductionShippingDto {
  @ApiProperty()
  shipping_name: string;

  @ApiProperty()
  shipping_vendor_name: string;

  @ApiProperty()
  shipping_date: string;

  @ApiProperty()
  shipping_cost?: number;

  project_detail_id?: number;

  created_by?: number;
  created_at?: string;
}

export class ProjectProductionShippingPackingDetailDto {
  @ApiProperty()
  size_ratio: string;

  @ApiProperty()
  number_of_item: number;

  project_shipping_packing_id?: number;
}

export class ProjectProductionShippingPackingDto {
  @ApiProperty()
  variant_name: string;

  @ApiProperty()
  variant_id: number;

  @ApiProperty()
  total_item?: number;

  @ApiProperty({
    isArray: true,
    type: ProjectProductionShippingPackingDetailDto,
  })
  @ValidateNested({ each: true })
  @Type(() => ProjectProductionShippingPackingDetailDto)
  detail?: ProjectProductionShippingPackingDetailDto[];
}
