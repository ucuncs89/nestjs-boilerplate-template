import { ApiProperty } from '@nestjs/swagger';
import { OrderTypeProjectEnum } from './create-project.dto';

export enum StatusProjectEnum {
  Project_Created = 'Project Created',
  Costing = 'Costing',
  Planning = 'Planning',
  Sampling = 'Sampling',
  Production = 'Production',
  Delivery = 'Delivery',
  Penagihan = 'Penagihan',
  Complete = 'Complete',
  Canceled = 'Canceled',
  Hold = 'Hold',
  Retur = 'Retur',
  Draft = 'Draft',
}

export enum DeadlineFilterProjectEnum {
  Now = 'Now',
  WeekMore = 'WeekMore',
}
export class GetListProjectDto {
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

  @ApiProperty({ required: false, enum: StatusProjectEnum })
  status?: string;

  @ApiProperty({ required: false, enum: OrderTypeProjectEnum })
  order_type?: OrderTypeProjectEnum;

  @ApiProperty({ required: false, enum: DeadlineFilterProjectEnum })
  deadline?: DeadlineFilterProjectEnum;
}
