import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUsersRoles {
  @IsNotEmpty()
  @ApiProperty()
  id: number;
}
export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty()
  full_name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty({
    isArray: true,
    type: CreateUsersRoles,
  })
  @IsNotEmpty()
  roles: CreateUsersRoles[];
}
