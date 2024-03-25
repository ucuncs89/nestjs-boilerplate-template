import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Connection, ILike, IsNull, Not, Repository } from 'typeorm';
import { GetListInvoiceDto } from '../dto/get-list-invoice.dto';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { InvoiceEntity } from 'src/entities/invoice/invoice.entity';
import {
  InvoiceApprovalDto,
  InvoiceDetailDto,
  InvoiceDto,
  InvoicePPHTypeEnum,
  InvoicePPNTypeEnum,
  InvoiceStatusEnum,
  InvoiceStatusPaymentDto,
  InvoiceTypeEnum,
  StatusInvoiceEnum,
} from '../dto/invoice.dto';
import { InvoiceStatusEntity } from 'src/entities/invoice/invoice_status.entity';
import { InvoiceDetailEntity } from 'src/entities/invoice/invoice_detail.entity';

@Injectable()
export class InvoiceService {
  constructor(
    private connection: Connection,

    @InjectRepository(InvoiceEntity)
    private invoiceRepository: Repository<InvoiceEntity>,

    @InjectRepository(InvoiceStatusEntity)
    private invoiceStatusRepository: Repository<InvoiceStatusEntity>,

    @InjectRepository(InvoiceDetailEntity)
    private invoiceDetailRepository: Repository<InvoiceDetailEntity>,
  ) {}

  async create(
    project_id: number,
    invoiceDto: InvoiceDto,
    user_id: number,
    invoiceDetailDto: InvoiceDetailDto[],
    grand_total: number,
  ) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const code = await this.generateCodeInvoice();
      const invoice = await queryRunner.manager.insert(InvoiceEntity, {
        ...invoiceDto,
        code,
        created_by: user_id,
        status: StatusInvoiceEnum.Waiting,
        created_at: new Date().toISOString(),
        project_id,
        grand_total,
      });
      await queryRunner.manager.insert(InvoiceStatusEntity, [
        {
          invoice_id: invoice.raw[0].id,
          status_desc: InvoiceStatusEnum.RequestByTheProduction,
          updated_by: user_id,
          updated_at: new Date().toISOString(),
          status: StatusInvoiceEnum.Approved,
        },
        {
          invoice_id: invoice.raw[0].id,
          status_desc: InvoiceStatusEnum.CreatedByTheFinance,
        },
      ]);
      if (invoiceDetailDto.length > 0) {
        for (const detail of invoiceDetailDto) {
          detail.invoice_id = invoice.raw[0].id;
        }
        await queryRunner.manager.insert(InvoiceDetailEntity, invoiceDetailDto);
      }
      await queryRunner.commitTransaction();
      return invoiceDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
  async updateInvoice(id: number, invoiceDto: InvoiceDto, user_id: number) {
    try {
      // let
      if (invoiceDto.ppn_type === InvoicePPNTypeEnum.Non_PPN) {
        invoiceDto.ppn = null;
      }
      switch (invoiceDto.pph_type) {
        case InvoicePPHTypeEnum.PPH_23:
          invoiceDto.pph = 2;
          break;
        case InvoicePPHTypeEnum.PPH_4_2:
          invoiceDto.pph = 0.5;
          break;

        default:
          invoiceDto.pph = null;
          break;
      }
      const data = await this.invoiceRepository.update(
        { id },
        {
          company_address: invoiceDto.company_address,
          company_phone_number: invoiceDto.company_phone_number,
          ppn_type: invoiceDto.ppn_type,
          ppn: invoiceDto.ppn,
          pph_type: invoiceDto.pph_type,
          pph: invoiceDto.pph,
          discount: invoiceDto.discount,
          bank_name: invoiceDto.bank_name,
          bank_account_number: invoiceDto.bank_account_number,
          bank_account_houlders_name: invoiceDto.bank_account_houlders_name,
          payment_term: invoiceDto.payment_term,
          notes: invoiceDto.notes,
        },
      );
      return data;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async findAll(query: GetListInvoiceDto) {
    const { page, page_size, sort_by, order_by, keyword, type, project_id } =
      query;
    let orderObj = {};
    switch (sort_by) {
      case 'name':
        orderObj = {
          company_name: order_by,
        };
      case 'code':
        orderObj = {
          code: order_by,
        };
      case 'created_at':
        orderObj = {
          id: order_by,
        };
        break;
    }
    const start_date = query.start_date
      ? new Date(`${query.start_date}T00:00:00.007Z`).toISOString()
      : null;
    const end_date = query.end_date
      ? new Date(`${query.end_date}T23:59:59.597Z`).toISOString()
      : null;

    const [data, total] = await this.invoiceRepository.findAndCount({
      where: [
        {
          company_name: keyword ? ILike(`%${keyword}%`) : Not(IsNull()),
          deleted_at: IsNull(),
          deleted_by: IsNull(),
          created_at:
            start_date && end_date
              ? Between(start_date, end_date)
              : Not(IsNull()),
          type: type ? type : Not(IsNull()),
          project_id: project_id ? project_id : Not(IsNull()),
        },
        {
          code: keyword ? ILike(`%${keyword}%`) : Not(IsNull()),
          deleted_at: IsNull(),
          deleted_by: IsNull(),
          created_at:
            start_date && end_date
              ? Between(start_date, end_date)
              : Not(IsNull()),
          project_id: project_id ? project_id : Not(IsNull()),
        },
      ],
      select: {
        id: true,
        project_id: true,
        code: true,
        customer_id: true,
        company_name: true,
        company_address: true,
        company_phone_number: true,
        ppn: true,
        ppn_type: true,
        pph: true,
        pph_type: true,
        discount: true,
        bank_name: true,
        bank_account_number: true,
        bank_account_houlders_name: true,
        payment_term: true,
        payment_term_unit: true,
        notes: true,
        status: true,
        type: true,
        retur_id: true,
        created_at: true,
        grand_total: true,
        status_payment: true,
        status_payment_attempt_user: true,
        project: {
          id: true,
          style_name: true,
          order_type: true,
          users: {
            id: true,
            full_name: true,
            path_picture: true,
            base_path: true,
          },
          departements: {
            id: true,
            code: true,
            name: true,
          },
          categories: {
            id: true,
            name: true,
          },
        },
      },
      order: orderObj,
      take: page_size,
      skip: page,
      relations: {
        project: { users: true, departements: true, categories: true },
      },
    });
    return {
      data,
      total_data: total,
    };
  }

  async findOne(id: number) {
    const data = await this.invoiceRepository.findOne({
      where: { id, deleted_at: IsNull(), deleted_by: IsNull() },
      select: {
        id: true,
        project_id: true,
        code: true,
        customer_id: true,
        company_name: true,
        company_address: true,
        company_phone_number: true,
        ppn: true,
        ppn_type: true,
        pph: true,
        pph_type: true,
        discount: true,
        bank_name: true,
        bank_account_number: true,
        bank_account_houlders_name: true,
        payment_term: true,
        payment_term_unit: true,
        notes: true,
        status: true,
        delivery_date: true,
        grand_total: true,
        created_at: true,
        type: true,
        payment_attempt: {
          id: true,
          full_name: true,
        },
      },
      relations: {
        payment_attempt: true,
      },
    });
    if (!data) {
      throw new AppErrorNotFoundException();
    }
    return data;
  }

  async remove(id: number, user_id) {
    const data = await this.invoiceRepository.update(
      { id },
      { deleted_at: new Date().toISOString(), deleted_by: user_id },
    );
    return data;
  }

  async generateCodeInvoice() {
    const pad = '0000';
    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '');
    try {
      const packaging = await this.invoiceRepository.find({
        select: { id: true },
        order: {
          id: 'DESC',
        },
        take: 1,
      });
      const id = packaging[0] ? `${packaging[0].id + 1}` : '1';
      return `INV-${formattedDate}-${
        pad.substring(0, pad.length - id.length) + id
      }`;
    } catch (error) {
      throw new Error(error);
    }
  }
  async findByProjectId(project_id: number, type: InvoiceTypeEnum) {
    const data = await this.invoiceRepository.findOne({
      where: {
        project_id,
        type,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
    });
    return data;
  }
  async findByProjectRetur(
    project_id: number,
    type: InvoiceTypeEnum,
    retur_id: number,
  ) {
    const data = await this.invoiceRepository.findOne({
      where: {
        project_id,
        type,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
        retur_id,
      },
    });
    return data;
  }

  async findDetail(id: number) {
    const invoice = await this.findOne(id);
    const costDetails = await this.invoiceDetailRepository.find({
      where: {
        invoice_id: id,
      },
    });
    const subGrandTotal = costDetails.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.sub_total;
    }, 0);
    const pph_result = (invoice.pph * subGrandTotal) / 100;
    const ppn_result = (invoice.ppn * subGrandTotal) / 100;
    const resultGrandTotal =
      subGrandTotal + ppn_result - pph_result - invoice.discount;
    const invoice_status = await this.findInvoiceStatus(id);
    return {
      ...invoice,
      invoice_status,
      cost_details: costDetails,
      pph_result,
      ppn_result,
      total: subGrandTotal,
      grand_total: resultGrandTotal,
    };
  }
  async findInvoiceStatus(invoice_id: number) {
    const data = await this.invoiceStatusRepository.find({
      where: {
        invoice_id,
        deleted_at: IsNull(),
        deleted_by: IsNull(),
      },
      select: {
        id: true,
        invoice_id: true,
        status_desc: true,
        status: true,
        reason: true,
        updated_at: true,
        updated_by: true,
        users: {
          id: true,
          full_name: true,
        },
      },
      relations: { users: true },
      order: { id: 'asc' },
    });
    return data;
  }
  async updateInvoiceApproval(
    invoice_id: number,
    status_id: number,
    invoiceApprovalDto: InvoiceApprovalDto,
    user_id: number,
  ) {
    try {
      let updateToProject: any;
      const status = await this.invoiceStatusRepository.findOne({
        where: { id: status_id, invoice_id },
      });
      if (!status) {
        throw new AppErrorNotFoundException();
      }
      status.updated_at = new Date().toISOString();
      status.updated_by = user_id;
      status.status = invoiceApprovalDto.status;
      status.reason = invoiceApprovalDto.reason;
      await this.invoiceStatusRepository.save(status);
      if (status.status_desc === InvoiceStatusEnum.CreatedByTheFinance) {
        await this.invoiceRepository.update(
          { id: invoice_id },
          { status: invoiceApprovalDto.status },
        );
      }
      if (invoiceApprovalDto.status === StatusInvoiceEnum.Rejected) {
        await this.invoiceRepository.update(
          { id: invoice_id },
          { status: invoiceApprovalDto.status },
        );
      }
      return { status, updateToProject };
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
  async cancelInvoiceApproval(
    invoice_id: number,
    status_id: number,
    user_id: number,
  ) {
    let updateToProject: any;
    const status = await this.invoiceStatusRepository.findOne({
      where: { id: status_id, invoice_id },
    });
    if (!status) {
      throw new AppErrorNotFoundException();
    }
    status.updated_at = null;
    status.updated_by = null;
    status.status = null;
    status.reason = null;
    await this.invoiceStatusRepository.save(status);
    await this.invoiceRepository.update(
      { id: invoice_id },
      { status: StatusInvoiceEnum.Waiting },
    );
    return { status, updateToProject };
  }
  async updateStatusPayment(
    invoice_id: number,
    invoiceStatusPaymentDto: InvoiceStatusPaymentDto,
    user_id: number,
  ) {
    const data = await this.invoiceRepository.update(
      { id: invoice_id },
      {
        status_payment: invoiceStatusPaymentDto.status_payment,
        status_payment_attempt_user: user_id,
      },
    );
    return data;
  }
}
