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
  @IsNotEmpty({ message: 'email_not_empty' })
  @IsEmail({}, { message: 'email_not_valid' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'password_not_empty' })
  password: string;
}
