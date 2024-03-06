import { ApiProperty } from '@nestjs/swagger';

export class ProjectProductionAdditionalCostDto {
  @ApiProperty()
  additional_name: string;

  @ApiProperty()
  additional_price: number;

  @ApiProperty()
  description?: string;
}
