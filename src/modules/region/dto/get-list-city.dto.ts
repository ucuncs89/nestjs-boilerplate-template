import { ApiProperty } from '@nestjs/swagger';

export class GetListCityDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;

  @ApiProperty({ required: false })
  order_by: string;

  @ApiProperty({ required: false })
  sort_by?: string;

  @ApiProperty({ required: false })
  keyword?: string;

  @ApiProperty({ required: false })
  province_id?: number;
}
