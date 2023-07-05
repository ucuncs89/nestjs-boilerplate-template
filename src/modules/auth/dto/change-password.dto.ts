import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Password Now Is Required' })
  old_password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password Now Is Required' })
  new_password: string;
}
