import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { Connection, In, IsNull, Repository } from 'typeorm';

import { InvoiceEntity } from 'src/entities/invoice/invoice.entity';
import { ProjectInvoiceEntity } from 'src/entities/project/project_invoice.entity';
import { InvoiceHistoryEntity } from 'src/entities/invoice/invoice_history.entity';
import { ProjectProductionInvoiceDto } from '../dto/project-production-invoice.dto';
import { InvoiceApprovalEntity } from 'src/entities/invoice/invoice_approval.entity';
import { InvoiceService } from 'src/modules/invoice/services/invoice.service';

@Injectable()
export class ProjectProductionInvoiceService {
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
    projectProductionInvoiceDto: ProjectProductionInvoiceDto,
    user_id,
  ) {
    const code = await this.invoiceService.generateCodePurchaseOrder();
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const invoice = await queryRunner.manager.insert(InvoiceEntity, {
        ...projectProductionInvoiceDto,
        code,
        status: 'Submitted',
        project_id,
      });
      await queryRunner.manager.insert(ProjectInvoiceEntity, {
        project_detail_id,
        invoice_id: invoice.raw[0].id,
        created_at: new Date().toISOString(),
        created_by: user_id,
        customer_id: projectProductionInvoiceDto.customer_id,
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
        ...projectProductionInvoiceDto,
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
    projectProductionInvoiceDto: ProjectProductionInvoiceDto,
    user_id: number,
  ) {
    try {
      await this.invoiceRepository.update(
        {
          id: invoice_id,
        },
        {
          customer_id: projectProductionInvoiceDto.customer_id,
          company_name: projectProductionInvoiceDto.company_name,
          company_address: projectProductionInvoiceDto.company_address,
          company_phone_number:
            projectProductionInvoiceDto.company_phone_number,
          ppn: projectProductionInvoiceDto.ppn,
          pph: projectProductionInvoiceDto.pph,
          discount: projectProductionInvoiceDto.discount,
          bank_account_number: projectProductionInvoiceDto.bank_account_number,
          bank_account_houlders_name:
            projectProductionInvoiceDto.bank_account_houlders_name,
          notes: projectProductionInvoiceDto.notes,
          updated_at: new Date().toISOString(),
          updated_by: user_id,
          payment_term: projectProductionInvoiceDto.payment_term,
        },
      );
      return { id: invoice_id, ...projectProductionInvoiceDto };
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
