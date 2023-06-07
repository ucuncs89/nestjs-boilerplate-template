import { ApiProperty } from '@nestjs/swagger';

export class GetRolesListDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;

  @ApiProperty({ required: false })
  search?: string;
}
