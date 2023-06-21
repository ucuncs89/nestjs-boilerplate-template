import { ApiProperty } from '@nestjs/swagger';

export class GetUserListDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;

  @ApiProperty({ required: false })
  search?: string;
}
