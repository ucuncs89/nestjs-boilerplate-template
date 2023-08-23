import { ApiProperty } from '@nestjs/swagger';

export class GetListCustomersNoteDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;
}
