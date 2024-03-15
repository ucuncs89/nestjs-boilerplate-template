import { ApiProperty } from '@nestjs/swagger';

export class ProjectReturStageDto {
  @ApiProperty()
  from_vendor_detail_id: number;

  @ApiProperty()
  from_vendor_detail_name: string;

  @ApiProperty()
  from_vendor_activity_name: string;

  @ApiProperty()
  to_vendor_detail_id: number;

  @ApiProperty()
  to_vendor_detail_name: string;

  @ApiProperty()
  to_vendor_activity_name: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  quantity_unit: string;
}
