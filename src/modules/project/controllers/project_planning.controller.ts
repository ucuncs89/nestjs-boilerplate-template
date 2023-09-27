import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ProjectHistoryService } from '../services/project_history.service';
import { RolesGuard } from 'src/modules/roles/roles.guard';
import { HasRoles } from 'src/modules/roles/has-roles.decorator';
import { Role } from 'src/modules/roles/enum/role.enum';
import { ProjectPlanningService } from '../services/project_planning.service';
import { CreateProjectPlanningDto } from '../dto/create-project-planning.dto';
import {
  CreatePlanningFabricDto,
  UpdatePlanningFabricDto,
} from '../dto/planning-fabric.dto';
import {
  CreatePlanningSewingDto,
  UpdatePlanningSewingDto,
} from '../dto/planning-sewing.dto';
import {
  CreatePlanningPackagingDto,
  UpdatePlanningPackagingDto,
} from '../dto/planning-packaging.dto';

@ApiBearerAuth()
@ApiTags('project')
@UseGuards(JwtAuthGuard, RolesGuard)
@HasRoles(Role.SUPERADMIN, Role.DEVELOPMENT)
@Controller('project')
export class ProjectPlanningController {
  constructor(
    private readonly projectHistoryService: ProjectHistoryService,
    private readonly projectPlanningService: ProjectPlanningService,
  ) {}

  @Post(':project_id/planning')
  async postPlanning(
    @Req() req,
    @Body() createProjectPlanningDto: CreateProjectPlanningDto,
    @Param('project_id') project_id: number,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.projectPlanningService.create(
      createProjectPlanningDto,
      project_id,
      req.user.id,
      i18n,
    );
    return { message: 'Successfully', data };
  }

  //planing fabric post
  @Post(':project_id/planning/:planning_id/fabric')
  async postPlanningFabric(
    @Req() req,
    @Body() createPlanningFabricDto: CreatePlanningFabricDto,
    @Param('project_id') project_id: number,
    @Param('planning_id') planning_id: number,
  ) {
    const data = await this.projectPlanningService.createPlanningFabric(
      createPlanningFabricDto,
      project_id,
      planning_id,
      req.user.id,
    );
    return { message: 'Successfully', data };
  }
  @Put(':project_id/planning/:planning_id/fabric/:planning_fabric_id')
  async putPlanningFabric(
    @Req() req,
    @Body() updatePlanningFabricDto: UpdatePlanningFabricDto,
    @Param('project_id') project_id: number,
    @Param('planning_id') planning_id: number,
    @Param('planning_fabric_id') planning_fabric_id: number,
  ) {
    const data = await this.projectPlanningService.updatePlanningFabric(
      updatePlanningFabricDto,
      project_id,
      planning_id,
      planning_fabric_id,
      req.user.id,
    );
    return { message: 'Successfully', data };
  }
  @Get(':project_id/planning/:planning_id/fabric')
  async getPlanningFabric(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('planning_id') planning_id: number,
  ) {
    const data = await this.projectPlanningService.findPlanningFabric(
      planning_id,
    );
    return { message: 'Successfully', data };
  }

  @Get(':project_id/planning/:planning_id/fabric/:planning_fabric_id')
  async detailPlanningFabric(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('planning_id') planning_id: number,
    @Param('planning_fabric_id') planning_fabric_id: number,
  ) {
    const data = await this.projectPlanningService.findDetailPlanningFabric(
      planning_id,
      planning_fabric_id,
    );
    return { message: 'Successfully', data };
  }

  @Delete(':project_id/planning/:planning_id/fabric/:planning_fabric_id')
  async removelPlanningFabric(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('planning_id') planning_id: number,
    @Param('planning_fabric_id') planning_fabric_id: number,
  ) {
    const data = await this.projectPlanningService.removePlanningFabric(
      planning_id,
      planning_fabric_id,
      req.user.id,
    );
    return { message: 'Successfully', data };
  }

  //planing sewing post
  @Post(':project_id/planning/:planning_id/accessories-sewing')
  async postPlanningSewing(
    @Req() req,
    @Body() createPlanningSewingDto: CreatePlanningSewingDto,
    @Param('project_id') project_id: number,
    @Param('planning_id') planning_id: number,
  ) {
    const data = await this.projectPlanningService.createPlanningSewing(
      createPlanningSewingDto,
      planning_id,
      req.user.id,
    );
    return { message: 'Successfully', data };
  }
  @Put(
    ':project_id/planning/:planning_id/accessories-sewing/:planning_accessories_sewing_id',
  )
  async putPlanningSewing(
    @Req() req,
    @Body() updatePlanningSewingDto: UpdatePlanningSewingDto,
    @Param('project_id') project_id: number,
    @Param('planning_id') planning_id: number,
    @Param('planning_accessories_sewing_id')
    planning_accessories_sewing_id: number,
  ) {
    const data = await this.projectPlanningService.updatePlanningSewing(
      updatePlanningSewingDto,
      planning_accessories_sewing_id,
      req.user.id,
    );
    return { message: 'Successfully', data };
  }
  @Get(':project_id/planning/:planning_id/accessories-sewing')
  async getPlanningSewing(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('planning_id') planning_id: number,
  ) {
    const data = await this.projectPlanningService.findPlanningSewing(
      planning_id,
    );
    return { message: 'Successfully', data };
  }

  @Get(
    ':project_id/planning/:planning_id/accessories-sewing/:planning_accessories_sewing_id',
  )
  async detailPlanningSewing(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('planning_id') planning_id: number,
    @Param('planning_accessories_sewing_id')
    planning_accessories_sewing_id: number,
  ) {
    const data = await this.projectPlanningService.findDetailPlanningSewing(
      planning_id,
      planning_accessories_sewing_id,
    );
    return { message: 'Successfully', data };
  }

  @Delete(
    ':project_id/planning/:planning_id/accessories-sewing/:planning_accessories_sewing_id',
  )
  async removePlanningSewing(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('planning_id') planning_id: number,
    @Param('planning_accessories_sewing_id')
    planning_accessories_sewing_id: number,
  ) {
    const data = await this.projectPlanningService.removePlanningSewing(
      planning_id,
      planning_accessories_sewing_id,
      req.user.id,
    );
    return { message: 'Successfully', data };
  }

  //planing packaging post
  @Post(':project_id/planning/:planning_id/accessories-packaging')
  async postPlanningPackaging(
    @Req() req,
    @Body() createPlanningPackagingDto: CreatePlanningPackagingDto,
    @Param('project_id') project_id: number,
    @Param('planning_id') planning_id: number,
  ) {
    const data = await this.projectPlanningService.createPlanningPackaging(
      createPlanningPackagingDto,
      planning_id,
      req.user.id,
    );
    return { message: 'Successfully', data };
  }
  @Put(
    ':project_id/planning/:planning_id/accessories-packaging/:planning_accessories_packaging_id',
  )
  async putPlanningPackaging(
    @Req() req,
    @Body() updatePlanningPackagingDto: UpdatePlanningPackagingDto,
    @Param('project_id') project_id: number,
    @Param('planning_id') planning_id: number,
    @Param('planning_accessories_packaging_id')
    planning_accessories_sewing_id: number,
  ) {
    const data = await this.projectPlanningService.updatePlanningPackaging(
      updatePlanningPackagingDto,
      planning_accessories_sewing_id,
      req.user.id,
    );
    return { message: 'Successfully', data };
  }
  @Get(':project_id/planning/:planning_id/accessories-packaging')
  async getPlanningPackaging(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('planning_id') planning_id: number,
  ) {
    const data = await this.projectPlanningService.findPlanningPackaging(
      planning_id,
    );
    return { message: 'Successfully', data };
  }

  @Get(
    ':project_id/planning/:planning_id/accessories-packaging/:planning_accessories_packaging_id',
  )
  async detailPlanningPackaging(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('planning_id') planning_id: number,
    @Param('planning_accessories_packaging_id')
    planning_accessories_packaging_id: number,
  ) {
    const data = await this.projectPlanningService.findDetailPlanningPackaging(
      planning_id,
      planning_accessories_packaging_id,
    );
    return { message: 'Successfully', data };
  }

  @Delete(
    ':project_id/planning/:planning_id/accessories-packaging/:planning_accessories_packaging_id',
  )
  async removePlanningPackaging(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('planning_id') planning_id: number,
    @Param('planning_accessories_packaging_id')
    planning_accessories_packaging_id: number,
  ) {
    const data = await this.projectPlanningService.removePlanningPackaging(
      planning_id,
      planning_accessories_packaging_id,
      req.user.id,
    );
    return { message: 'Successfully', data };
  }
}
