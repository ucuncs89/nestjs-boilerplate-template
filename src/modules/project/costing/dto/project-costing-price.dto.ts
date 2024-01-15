import { ApiProperty } from '@nestjs/swagger';

export class ProjectCostingPriceDto {
  @ApiProperty()
  selling_price_per_item: number;

  @ApiProperty()
  loss_percentage: number;

  @ApiProperty()
  commission: number;
}
