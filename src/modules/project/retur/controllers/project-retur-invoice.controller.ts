import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { InvoiceService } from 'src/modules/invoice/services/invoice.service';
import { ProjectService } from '../../general/services/project.service';
import { ProjectPlanningPriceService } from '../../planning/services/project-planning-price.service';
import { InvoiceTypeEnum } from 'src/modules/invoice/dto/invoice.dto';
import { ProjectReturService } from '../../general/services/project-retur.service';

@ApiBearerAuth()
@ApiTags('project retur')
@UseGuards(JwtAuthGuard)
@Controller('project/retur')
export class ProjectReturInvoiceController {
  constructor(
    private invoiceService: InvoiceService,
    private projectService: ProjectService,
    private projectPlanningPriceService: ProjectPlanningPriceService,
    private projectReturService: ProjectReturService,
  ) {}

  @Get(':project_id/:retur_id/invoice')
  async getProjectReturInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('retur_id') retur_id: number,
  ) {
    const data = await this.invoiceService.findByProjectRetur(
      project_id,
      InvoiceTypeEnum.retur,
      retur_id,
    );
    return { data };
  }
  @Post(':project_id/:retur_id/invoice')
  async postProjectReturInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
    @Param('retur_id') retur_id: number,
  ) {
    const invoiceDetailDto = [];
    let totalItem = 0;
    const invoice = await this.invoiceService.findByProjectRetur(
      project_id,
      InvoiceTypeEnum.retur,
      retur_id,
    );
    if (!invoice) {
      const projectRetur = await this.projectReturService.findOne(
        retur_id,
        project_id,
      );
      const price = await this.projectPlanningPriceService.findPricePlanning(
        project_id,
      );
      const customer = await this.projectService.findCustomerRelation(
        project_id,
      );

      if (projectRetur) {
        totalItem += projectRetur.quantity;
        invoiceDetailDto.push({
          item: `${projectRetur.description}`,
          unit: 'PCS',
          quantity: projectRetur.quantity,
          unit_price: price.selling_price_per_item,
          sub_total: price.selling_price_per_item * projectRetur.quantity,
        });

        const grand_total = totalItem * price.selling_price_per_item;
        const data = await this.invoiceService.create(
          project_id,
          {
            bank_name: customer.bank_name,
            company_name: customer.company_name,
            customer_id: customer.id,
            project_id,
            bank_account_houlders_name: customer.bank_account_holder_name,
            bank_account_number: customer.bank_account_number,
            company_address: customer.company_address,
            company_phone_number: customer.company_phone_number,
            retur_id,
            type: InvoiceTypeEnum.retur,
          },
          req.user.id,
          invoiceDetailDto,
          grand_total,
        );
        return { data, projectRetur, grand_total, totalItem };
      }
    }
  }
}
