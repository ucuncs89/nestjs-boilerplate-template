import { ApiProperty } from '@nestjs/swagger';

export class HomeDto {
  @ApiProperty({ required: false })
  start_date?: string;

  @ApiProperty({ required: false })
  end_date?: string;
}
