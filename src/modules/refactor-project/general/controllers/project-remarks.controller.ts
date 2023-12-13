import {
  Controller,
  Get,
  Param,
  UseGuards,
  Query,
  Post,
  Body,
  Req,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Pagination } from 'src/utils/pagination';
import { ProjectRemarksService } from '../services/project-remarks.service';
import {
  GetListProjectRemarksDto,
  ProjectRemarksDto,
} from '../dto/project-remarks.dto';

@ApiBearerAuth()
@ApiTags('refactor-project')
@UseGuards(JwtAuthGuard)
@Controller('refactor-project')
export class ProjectRemarksController {
  constructor(private readonly projectRemarksService: ProjectRemarksService) {}

  @Get(':project_id/remarks')
  async findAll(
    @Query() query: GetListProjectRemarksDto,
    @Param('project_id') project_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.projectRemarksService.findAll(
      {
        page: (_page - 1) * _page_size,
        page_size: _page_size,
        sort_by: query.sort_by || 'created_at',
        order_by: query.order_by || 'DESC',
      },
      project_id,
    );
    const pagination = await Pagination.pagination(
      data.total_data,
      _page,
      _page_size,
      `/project/${project_id}/remarks`,
    );
    return { message: 'Successfully', data, pagination };
  }
  @Post(':project_id/remarks')
  async create(
    @Req() req,
    @Body() projectRemarksDto: ProjectRemarksDto,
    @Param('project_id') project_id: number,
  ) {
    const data = await this.projectRemarksService.createProjectRemarks(
      project_id,
      projectRemarksDto,
      req.user.id,
    );
    return { data };
  }

  @Get(':project_id/remarks/:remarks_id')
  async getOne(
    @Param('project_id') project_id: number,
    @Param('remarks_id') remarks_id: number,
  ) {
    const data = await this.projectRemarksService.findOne(remarks_id);
    return { data };
  }

  @Put(':project_id/remarks/:remarks_id')
  async updateRemarks(
    @Req() req,
    @Body() projectRemarksDto: ProjectRemarksDto,
    @Param('project_id') project_id: number,
    @Param('remarks_id') remarks_id: number,
  ) {
    const data = await this.projectRemarksService.updateProjectRemarks(
      project_id,
      remarks_id,
      projectRemarksDto,
      req.user.id,
    );
    return { data };
  }
  @Delete(':project_id/remarks/:remarks_id')
  async deleteRemarks(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('remarks_id') remarks_id: number,
  ) {
    const data = await this.projectRemarksService.deleteProjectRemarks(
      project_id,
      remarks_id,
    );
    return { data };
  }
}
