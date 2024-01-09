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
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import {
  CreateProjectDto,
  ProjectMaterialSourceDto,
} from '../dto/create-project.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { RabbitMQService } from 'src/rabbitmq/services/rabbit-mq.service';
import { GetListProjectDto } from '../dto/get-list-project.dto';
import { Pagination } from 'src/utils/pagination';

@ApiBearerAuth()
@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('generate')
  async generate(@Req() req) {
    const data = await this.projectService.generate(req.user.id);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/create')
  async createOne(
    @Req() req,
    @Param('id') id: number,
    @Body() createProjectDto: CreateProjectDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectService.createUpdate(
      id,
      createProjectDto,
      req.user.id,
      i18n,
    );
    // this.rabbitMQService.send('send-notification-project-new', {
    //   from_user_id: req.user.id,
    //   from_user_fullname: req.user.full_name,
    //   message: `${req.user.full_name} added a new project`,
    // });
    return { data };
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: GetListProjectDto) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.projectService.findAll({
      page: (_page - 1) * _page_size,
      page_size: _page_size,
      sort_by: query.sort_by || 'created_at',
      order_by: query.order_by || 'DESC',
      status: query.status,
      keyword: query.keyword,
      order_type: query.order_type,
      deadline: query.deadline,
    });
    const pagination = await Pagination.pagination(
      data.total_data,
      _page,
      _page_size,
      `/project`,
    );
    return { message: 'Successfully', data, pagination };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.projectService.findOne(+id, i18n);
    return { message: 'Successfully', data };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/material-source')
  async updateMaterialSource(
    @Req() req,
    @Param('id') id: number,
    @Body() projectMaterialSourceDto: ProjectMaterialSourceDto,
  ) {
    return this.projectService.updateMaterialSource(
      id,
      projectMaterialSourceDto,
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('id')
  async publishNewProject(@Req() req, @Param('id') id: number) {
    const data = await this.projectService.publishNewProject(id, req.user.id);
    return { data };
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.projectService.remove(+id);
  // }
}
