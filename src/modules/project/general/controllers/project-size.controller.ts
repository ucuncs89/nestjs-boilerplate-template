import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ProjectSizeService } from '../services/project-size.service';
import { ProjectSizeDto } from '../dto/create-project.dto';

@ApiBearerAuth()
@ApiTags('project')
@Controller('project')
@UseGuards(JwtAuthGuard)
export class ProjectSizeController {
  constructor(private readonly projectSizeService: ProjectSizeService) {}

  @Post(':project_id/size')
  async createOne(
    @Req() req,
    @Param('project_id') project_id: number,
    @Body() projectSizeDto: ProjectSizeDto,
  ) {
    const data = await this.projectSizeService.create(
      project_id,
      projectSizeDto,
      req.user.id,
    );
    return { data };
  }

  @Get(':project_id/size')
  async findAllProjectSize(@Param('project_id') project_id: number) {
    const data = await this.projectSizeService.findAllProjectSize(project_id);
    return { data };
  }

  @Put(':project_id/size/:project_size_id')
  async updateProjectSize(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('project_size_id') project_size_id: number,
    @Body() projectSizeDto: ProjectSizeDto,
  ) {
    const data = await this.projectSizeService.updateProjectSize(
      project_size_id,
      project_id,
      projectSizeDto,
      req.user.id,
    );
    return { data };
  }

  @Delete(':project_id/size/:project_size_id')
  async deleteProjectSize(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('project_size_id') project_size_id: number,
  ) {
    const data = await this.projectSizeService.deleteProjectSize(
      project_size_id,
      project_id,
      req.user.id,
    );
    return { data };
  }
}
