import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}
