import { ApiProperty } from '@nestjs/swagger';

export class UserPermissionListDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;
}
