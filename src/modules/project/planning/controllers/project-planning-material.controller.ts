import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Query,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ProjectPlanningMaterialService } from '../services/project-planning-material.service';
import {
  GetListProjectMaterialDto,
  ProjectMaterialItemDto,
} from '../dto/project-planning-material.dto';
import { ProjectCostingMaterialService } from '../../costing/services/project-costing-material.service';
import { ProjectPlanningApprovalService } from '../../general/services/project-planning-approval.service';
import { StatusApprovalEnum } from '../../general/dto/project-planning-approval.dto';
import { TypeProjectDetailCalculateEnum } from '../../general/dto/project-detail.dto';
import { ProjectPlanningVendorMaterialService } from '../services/project-planning-vendor-material.service';

@ApiBearerAuth()
@ApiTags('project planning')
@UseGuards(JwtAuthGuard)
@Controller('project/planning')
export class ProjectPlanningMaterialController {
  constructor(
    private readonly projectPlanningMaterialService: ProjectPlanningMaterialService,
    private readonly projectCostingMaterialService: ProjectCostingMaterialService,
    private readonly projectPlanningApprovalService: ProjectPlanningApprovalService,
    private readonly projectPlanningVendorMaterialService: ProjectPlanningVendorMaterialService,
  ) {}

  @Get(':project_id/material')
  async listMaterialItem(
    @Param('project_id') project_id: number,
    @Query() getListProjectMaterialDto: GetListProjectMaterialDto,
  ) {
    const data = await this.projectPlanningMaterialService.findAllMaterialItem(
      project_id,
      getListProjectMaterialDto,
    );
    return {
      data,
    };
  }
  @Get(':project_id/material/compare')
  async listMaterialItemCompare(
    @Param('project_id') project_id: number,
    @Query() getListProjectMaterialDto: GetListProjectMaterialDto,
  ) {
    const costing =
      await this.projectCostingMaterialService.findAllMaterialItem(
        project_id,
        getListProjectMaterialDto,
      );
    const planning =
      await this.projectPlanningMaterialService.findAllMaterialItem(
        project_id,
        getListProjectMaterialDto,
      );
    return {
      costing,
      planning,
    };
  }
  @Post(':project_id/material')
  async createMaterialItem(
    @Req() req,
    @Param('project_id') project_id: number,
    @Body() projectMaterialItemDto: ProjectMaterialItemDto,
  ) {
    const data =
      await this.projectPlanningMaterialService.createMaterialItemOne(
        project_id,
        projectMaterialItemDto,
        req.user.id,
      );
    return {
      data,
    };
  }

  @Get(':project_id/material/:material_item_id')
  async findOneMaterialItem(
    @Param('project_id') project_id: number,
    @Param('material_item_id') material_item_id: number,
  ) {
    const data = await this.projectPlanningMaterialService.findOneMaterialItem(
      project_id,
      material_item_id,
    );
    return {
      data,
    };
  }

  @Put(':project_id/material/:material_item_id')
  async updateOneMaterialItem(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('material_item_id') material_item_id: number,
    @Body() projectMaterialItemDto: ProjectMaterialItemDto,
  ) {
    const data =
      await this.projectPlanningMaterialService.updateMaterialItemOne(
        project_id,
        material_item_id,
        projectMaterialItemDto,
        req.user.id,
      );
    if (data) {
      await this.projectPlanningVendorMaterialService.updateQuantityPriceUnitByMaterialId(
        material_item_id,
        projectMaterialItemDto.consumption_unit,
      );
    }
    return {
      data,
    };
  }
  @Delete(':project_id/material/:material_item_id')
  async deleteOneMaterialItem(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('material_item_id') material_item_id: number,
  ) {
    const data =
      await this.projectPlanningMaterialService.deleteMaterialItemOne(
        project_id,
        material_item_id,
        req.user.id,
      );
    return {
      data,
    };
  }
  @Post(':project_id/material/:material_item_id/approval-request')
  async approvalRequest(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('material_item_id') material_item_id: number,
  ) {
    const material =
      await this.projectPlanningMaterialService.findOneMaterialItem(
        project_id,
        material_item_id,
      );
    const data =
      await this.projectPlanningApprovalService.createPlanningApproval(
        {
          relation_id: material_item_id,
          status: StatusApprovalEnum.waiting,
          type: TypeProjectDetailCalculateEnum.Material,
          project_id,
          name: `${material.type} - ${material.name} - ${material.category} ${material.used_for}`,
        },
        req.user.id,
      );
    return { data };
  }
}
