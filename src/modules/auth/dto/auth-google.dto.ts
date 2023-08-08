import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthGoogleDTO {
  @ApiProperty()
  @IsNotEmpty()
  google_token: string;
}
