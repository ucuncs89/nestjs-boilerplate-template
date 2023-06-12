import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';

class Menu {
  @ApiProperty()
  @IsNotEmpty()
  menu_id: number;
}
export class CreateRoleMenuDto {
  @ApiProperty({
    isArray: true,
    type: Menu,
  })
  @ValidateNested({ each: true })
  @ApiProperty()
  menu: Menu[];
}
