import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class OtpVerificationDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'email_not_empty' })
  @IsEmail({}, { message: 'email_not_valid' })
  email: string;

  @ApiProperty()
  otp: string;
}
