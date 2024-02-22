import { ApiProperty } from '@nestjs/swagger';

export class PurchaseOrderDetailDto {
  @ApiProperty()
  relation_id: number;

  @ApiProperty()
  item: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unit: string;

  @ApiProperty()
  unit_price: number;

  @ApiProperty()
  sub_total: number;
}
