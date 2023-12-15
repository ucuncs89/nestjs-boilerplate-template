import { ApiProperty } from '@nestjs/swagger';

export class UserTokenDto {
  @ApiProperty()
  token: string;
}
