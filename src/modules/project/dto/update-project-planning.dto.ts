import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
import { CreateProjectPlanningDto } from './create-project-planning.dto';

export class UpdateProjectPlanningDto extends PartialType(
  CreateProjectPlanningDto,
) {}
