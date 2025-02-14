import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PutForgotPassword {
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
