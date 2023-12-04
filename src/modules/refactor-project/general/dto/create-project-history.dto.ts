import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum StatusProjectHistoryEnum {
  Project_Created = 'Project Created',
  Planning = 'Planning',
  Sampling = 'Sampling',
  Production = 'Production',
  Delivery = 'Delivery',
  Penagihan = 'Penagihan',
  Complete = 'Complete',
  Canceled = 'Canceled',
  Hold = 'Hold',
}

export class CreateProjecHistorytDto {
  @ApiProperty({ enum: StatusProjectHistoryEnum })
  @IsEnum(StatusProjectHistoryEnum)
  @IsNotEmpty()
  status: StatusProjectHistoryEnum;

  project_id?: number;
}
