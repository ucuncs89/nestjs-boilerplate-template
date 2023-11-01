import { ApiProperty } from '@nestjs/swagger';

export enum StatusProjectEnum {
  Planning = 'Planning',
  Sampling = 'Sampling',
  Production = 'Production',
  Delivery = 'Delivery',
  Penagihan = 'Penagihan',
  Complete = 'Complete',
  Canceled = 'Canceled',
  Hold = 'Hold',
}

export class GetListProjectHistoryDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;

  @ApiProperty({ required: false })
  order_by: string;

  @ApiProperty({ required: false })
  sort_by?: string;
}
