import { ApiProperty } from '@nestjs/swagger';

export class ProjectReturDto {
  @ApiProperty()
  quantity: number;

  @ApiProperty()
  description: string;
}
