import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ProjectPurchaseOrderService } from '../services/project-purchase-order.service';

@ApiBearerAuth()
@ApiTags('project purchase order')
@UseGuards(JwtAuthGuard)
@Controller('project/purchase-order')
export class ProjectPurchaseOrderController {
  constructor(
    private projectPurchaseOrderService: ProjectPurchaseOrderService,
  ) {}
  @Get(':project_id')
  async findAll(@Param('project_id') project_id: number) {
    const data = await this.projectPurchaseOrderService.findAllByProjectId(
      project_id,
    );
    return { data };
  }
}
