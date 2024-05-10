import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  PostCustomerJurnalDto,
  PostProductJurnalDto,
  PostSalesQuoteJurnalDto,
  TransactionLinesAttributesDto,
} from '../dto/invoice-jurnal.dto';
import { AppErrorException } from 'src/exceptions/app-exception';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceEntity } from 'src/entities/invoice/invoice.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InvoiceJurnalService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private invoiceRepository: Repository<InvoiceEntity>,
  ) {}
  async intregateToJurnalInvoice(invoice_id: number) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoice_id },
      relations: { project: true, customer: true, detail: true },
    });
    await this.postCustomerJurnal({
      source: 'cloami',
      address: invoice.company_address,
      associate_company: invoice.company_name,
      billing_address: invoice.company_address,
      display_name: invoice.company_name,
      email: invoice?.customer?.pic_email || '',
      first_name: invoice.company_name,
      phone: invoice.company_phone_number,
      title: invoice.company_name,
    });
    const arrDetail: PostProductJurnalDto[] = [];
    const arrTransactionLineAttributes: TransactionLinesAttributesDto[] = [];
    invoice.detail.map((v, i) =>
      arrDetail.push({
        buy_price_per_unit: `${v.unit_price ? v.unit_price : ''}`,
        name: v.item,
        unit_name: v.unit,
        sell_price_per_unit: `${v.unit_price ? v.unit_price : ''}`,
        product_code: `${invoice.project.code}-${i++}`,
      }),
    );
    invoice.detail.map((v, i) =>
      arrTransactionLineAttributes.push({
        quantity: v.quantity,
        rate: v.unit_price,
        product_name: v.item,
      }),
    );

    await this.postProductJurnal(arrDetail);
    const quoteSales = await this.postSalesQuoteInvoice({
      person_name: invoice.company_name,
      transaction_date: invoice.created_at,
      transaction_lines_attributes: arrTransactionLineAttributes,
    });
    if (quoteSales.sales_quote) {
      await this.converToInvoice(quoteSales.sales_quote.id);
    }
    return { invoice, arrDetail };
  }

  async postCustomerJurnal(postCustomerJurnalDto: PostCustomerJurnalDto) {
    try {
      const response = await axios({
        method: 'POST',
        url: 'https://sandbox-api.jurnal.id/partner/core/api/v1/customers?access_token=NuaQ5ySthn2R7TaiLG12tAzHNTJkwZhT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        data: JSON.stringify({
          customer: postCustomerJurnalDto,
        }),
      });
      return response.data;
    } catch (error) {
      if ((error.status = 409)) {
        return { status: error.status, message: 'duplicate' };
      }
      throw new AppErrorException(error.message);
    }
  }

  async postProductJurnal(postProductJurnalDto: PostProductJurnalDto[]) {
    const payload = {
      products: postProductJurnalDto.map((item) => ({
        product: {
          ...item,
        },
      })),
    };
    try {
      const response = await axios({
        method: 'POST',
        url: 'https://sandbox-api.jurnal.id/partner/core/api/v1/products/batch_create?access_token=NuaQ5ySthn2R7TaiLG12tAzHNTJkwZhT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        data: JSON.stringify({
          ...payload,
        }),
      });
      return response.data;
    } catch (error) {
      if ((error.status = 409)) {
        return { status: error.status, message: 'duplicate' };
      }
      throw new AppErrorException(error.message);
    }
  }
  async postSalesQuoteInvoice(
    postSalesQuoteJurnalDto: PostSalesQuoteJurnalDto,
  ) {
    try {
      const sales_quote = postSalesQuoteJurnalDto;
      const response = await axios({
        method: 'POST',
        url: 'https://sandbox-api.jurnal.id/partner/core/api/v1/sales_quotes?access_token=NuaQ5ySthn2R7TaiLG12tAzHNTJkwZhT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        data: { sales_quote },
      });
      return response.data;
    } catch (error) {
      if ((error.status = 409)) {
        return { status: error.status, message: 'duplicate' };
      }
      throw new AppErrorException(error.message);
    }
  }
  async converToInvoice(id_sales_quote_jurnal: number) {
    try {
      const response = await axios({
        method: 'POST',
        url: `https://sandbox-api.jurnal.id/partner/core/api/v1/sales_quotes/${id_sales_quote_jurnal}/convert_to_invoice?access_token=NuaQ5ySthn2R7TaiLG12tAzHNTJkwZhT`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new AppErrorException(error.message);
    }
  }
}
