import { ApiProperty } from '@nestjs/swagger';

export class ProjectCostingAdditionalCostDto {
  @ApiProperty()
  additional_name: string;

  @ApiProperty()
  additional_price: number;

  @ApiProperty()
  description?: string;
}
