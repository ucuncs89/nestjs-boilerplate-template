import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';
export class RegisterUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  full_name: string;
}
export class LoginUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
