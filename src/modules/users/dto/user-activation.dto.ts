import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserActivationDto {
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
