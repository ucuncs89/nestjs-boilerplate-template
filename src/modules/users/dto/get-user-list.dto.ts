import { ApiProperty } from '@nestjs/swagger';

export enum StatusActiveEnum {
  true = 'true',
  false = 'false',
}

export class GetUserListDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;

  @ApiProperty({ required: false })
  keyword?: string;

  @ApiProperty({ required: false })
  roles?: number;

  @ApiProperty({ required: false })
  order_by: string;

  @ApiProperty({ required: false })
  sort_by?: string;

  @ApiProperty({ required: false, enum: StatusActiveEnum })
  is_active?: StatusActiveEnum;
}
