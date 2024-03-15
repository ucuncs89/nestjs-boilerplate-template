import { ApiProperty } from '@nestjs/swagger';

export class ProjectReturShippingPackingDetailDto {
  @ApiProperty()
  size_ratio: string;

  @ApiProperty()
  number_of_item: number;

  project_shipping_packing_id?: number;
}
export class ProjectReturShippingPackingDto {
  @ApiProperty()
  variant_name: string;

  @ApiProperty()
  variant_id: number;

  @ApiProperty()
  total_item?: number;

  @ApiProperty({
    isArray: true,
    type: ProjectReturShippingPackingDetailDto,
  })
  detail: ProjectReturShippingPackingDetailDto[];
}
