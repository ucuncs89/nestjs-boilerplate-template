import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { Connection, In, IsNull, Repository } from 'typeorm';

import { InvoiceEntity } from 'src/entities/invoice/invoice.entity';
import { ProjectInvoiceEntity } from 'src/entities/project/project_invoice.entity';
import { ProjectInvoiceProductionDto } from '../dto/project-invoice-production.dto';
import { InvoiceHistoryEntity } from 'src/entities/invoice/invoice_history.entity';
import { InvoiceService } from 'src/modules/invoice/services/invoice.service';
import { InvoiceApprovalEntity } from 'src/entities/invoice/invoice_approval.entity';

@Injectable()
export class ProjectInvoiceProductionService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private invoiceRepository: Repository<InvoiceEntity>,

    @InjectRepository(ProjectInvoiceEntity)
    private projectInvoiceRepository: Repository<ProjectInvoiceEntity>,
    private invoiceService: InvoiceService,
    private connection: Connection,
  ) {}
  async createInvoice(
    project_id,
    project_detail_id,
    projectInvoiceProductionDto: ProjectInvoiceProductionDto,
    user_id,
  ) {
    const code = await this.invoiceService.generateCodePurchaseOrder();
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const invoice = await queryRunner.manager.insert(InvoiceEntity, {
        ...projectInvoiceProductionDto,
        code,
        status: 'Submitted',
        project_id,
      });
      await queryRunner.manager.insert(ProjectInvoiceEntity, {
        project_detail_id,
        invoice_id: invoice.raw[0].id,
        created_at: new Date().toISOString(),
        created_by: user_id,
        customer_id: projectInvoiceProductionDto.customer_id,
      });
      await queryRunner.manager.insert(InvoiceHistoryEntity, {
        invoice_id: invoice.raw[0].id,
        created_at: new Date().toISOString(),
        created_by: user_id,
      });
      await queryRunner.manager.insert(InvoiceApprovalEntity, [
        {
          invoice_id: invoice.raw[0].id,
          status_desc: 'Made by',
        },
        {
          invoice_id: invoice.raw[0].id,
          status_desc: 'Sent by the finance team',
        },
        {
          invoice_id: invoice.raw[0].id,
          status_desc: 'Approved by',
        },
      ]);
      await queryRunner.commitTransaction();
      this.invoiceService.updateGrandTotal(invoice.raw[0].id);
      return {
        id: invoice.raw[0].id,
        ...projectInvoiceProductionDto,
      };
    } catch (error) {
      console.log(error);

      await queryRunner.rollbackTransaction();

      throw new AppErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }
  async updateInvoice(
    invoice_id: number,
    projectInvoiceProductionDto: ProjectInvoiceProductionDto,
    user_id: number,
  ) {
    try {
      await this.invoiceRepository.update(
        {
          id: invoice_id,
        },
        {
          customer_id: projectInvoiceProductionDto.customer_id,
          company_name: projectInvoiceProductionDto.company_name,
          company_address: projectInvoiceProductionDto.company_address,
          company_phone_number:
            projectInvoiceProductionDto.company_phone_number,
          ppn: projectInvoiceProductionDto.ppn,
          pph: projectInvoiceProductionDto.pph,
          discount: projectInvoiceProductionDto.discount,
          bank_account_number: projectInvoiceProductionDto.bank_account_number,
          bank_account_houlders_name:
            projectInvoiceProductionDto.bank_account_houlders_name,
          notes: projectInvoiceProductionDto.notes,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
          payment_term: projectInvoiceProductionDto.payment_term,
        },
      );
      return { id: invoice_id, ...projectInvoiceProductionDto };
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async findDetailInvoice(invoice_id: number) {
    const data = await this.invoiceRepository.findOne({
      where: {
        id: invoice_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }
  async deleteInvoice(invoice_id, user_id) {
    await this.invoiceRepository.update(
      { id: invoice_id },
      { deleted_at: new Date().toISOString(), deleted_by: user_id },
    );
    await this.projectInvoiceRepository.update(
      { invoice_id },
      { deleted_at: new Date().toISOString(), deleted_by: user_id },
    );
  }
  async findByProjectDetailId(project_detail_id) {
    const projectInvoice = await this.projectInvoiceRepository.findOne({
      where: {
        project_detail_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    if (!projectInvoice) {
      return null;
    }
    const invoice = await this.invoiceRepository.findOne({
      where: {
        id: projectInvoice.invoice_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    return { ...projectInvoice, invoice };
  }
}
