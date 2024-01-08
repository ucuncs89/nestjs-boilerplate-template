import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { RabbitMQService } from 'src/rabbitmq/services/rabbit-mq.service';

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
  // @Get()
  // findAll() {
  //   return this.projectService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.projectService.findOne(+id);
  // }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
  //   return this.projectService.update(+id, updateProjectDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.projectService.remove(+id);
  // }
}
