import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { InvoiceService } from 'src/modules/invoice/services/invoice.service';
import { ProjectVariantService } from '../../general/services/project-variant.service';
import { ProjectService } from '../../general/services/project.service';
import { ProjectPlanningPriceService } from '../../planning/services/project-planning-price.service';
import {
  InvoiceDetailDto,
  InvoiceTypeEnum,
} from 'src/modules/invoice/dto/invoice.dto';

@ApiBearerAuth()
@ApiTags('project production')
@UseGuards(JwtAuthGuard)
@Controller('project/production')
export class ProjectProductionInvoiceController {
  constructor(
    private invoiceService: InvoiceService,
    private projectVariantService: ProjectVariantService,
    private projectService: ProjectService,
    private projectPlanningPriceService: ProjectPlanningPriceService,
  ) {}

  @Get(':project_id/invoice')
  async getProjectInvoice(@Req() req, @Param('project_id') project_id: number) {
    const data = await this.invoiceService.findByProjectId(
      project_id,
      InvoiceTypeEnum.purchase,
    );
    return { data };
  }
  @Post(':project_id/invoice')
  async postProjectInvoice(
    @Req() req,
    @Param('project_id') project_id: number,
  ) {
    const invoiceDetailDto = [];
    let totalItem = 0;
    const invoice = await this.invoiceService.findByProjectId(
      project_id,
      InvoiceTypeEnum.purchase,
    );
    if (!invoice) {
      const variant = await this.projectVariantService.findVariant(project_id);
      const price = await this.projectPlanningPriceService.findPricePlanning(
        project_id,
      );
      const customer = await this.projectService.findCustomerRelation(
        project_id,
      );

      if (variant.length > 0) {
        for (const objVariant of variant) {
          totalItem += objVariant.total_item;
          if (objVariant.project_variant_size.length > 0) {
            const arrVariantSize = [];
            for (const variantSize of objVariant.project_variant_size) {
              arrVariantSize.push(
                `${variantSize.size_ratio}=${variantSize.number_of_item}`,
              );
            }
            invoiceDetailDto.push({
              item: `${objVariant.name} (${arrVariantSize})`,
              unit: 'PCS',
              quantity: objVariant.total_item,
              unit_price: price.selling_price_per_item,
              sub_total: price.selling_price_per_item * objVariant.total_item,
            });
          }
        }
      }
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
          type: InvoiceTypeEnum.purchase,
        },
        req.user.id,
        invoiceDetailDto,
        grand_total,
      );
      return { data, variant, grand_total, totalItem };
    } else {
      return { data: 'masuk ke already tapi belum' };
    }
  }
}
