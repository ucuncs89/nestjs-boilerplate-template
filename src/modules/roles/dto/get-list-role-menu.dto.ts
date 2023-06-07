import { ApiProperty } from '@nestjs/swagger';

export class GetListRoleMenuDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;

  @ApiProperty({ required: false })
  search?: string;

  @ApiProperty({ required: false })
  parent_id: number;
}
