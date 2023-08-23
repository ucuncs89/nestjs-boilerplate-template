import { PartialType } from '@nestjs/swagger';
import { CreateAccessoryPackagingDto } from './create-accessory-packaging.dto';

export class UpdateAccessoryPackagingDto extends PartialType(
  CreateAccessoryPackagingDto,
) {}
