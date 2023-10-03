import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Put,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectDetailService } from '../services/project_detail.service';
import { CreateProjectDetailDto } from '../dto/create-project-detail.dto';
import { AppErrorException } from 'src/exceptions/app-exception';

@ApiBearerAuth()
@ApiTags('project')
@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectDetailController {
  constructor(private readonly projectDetailService: ProjectDetailService) {}

  @Post(':project_id/detail')
  async create(
    @Req() req,
    @Param('project_id') project_id: number,
    @Body() createProjectDetailDto: CreateProjectDetailDto,
    @I18n() i18n: I18nContext,
  ) {
    let data: any;
    switch (createProjectDetailDto.type) {
      case 'Planning':
        data = await this.projectDetailService.createProjectDetailPlanning(
          project_id,
          createProjectDetailDto,
          req.user.id,
          i18n,
        );
        break;
      default:
        throw new AppErrorException('Payload Type Project not allowed');
    }
    return { data };
  }
}
