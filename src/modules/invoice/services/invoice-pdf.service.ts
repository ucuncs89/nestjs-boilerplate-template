import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { AppErrorException } from 'src/exceptions/app-exception';
import { InvoiceTypeEnum } from '../dto/invoice.dto';
// import moment from 'moment';

@Injectable()
export class InvoicePdfService {
  async generatePdf(data: any) {
    try {
      switch (data.type) {
        case InvoiceTypeEnum.retur:
          data.title_invoice = 'Retur Invoice';
          break;
        case InvoiceTypeEnum.proforma:
          data.title_invoice = 'Proforma Invoice';
          break;
        case InvoiceTypeEnum.purchase:
          data.title_invoice = 'Invoice';
          break;
        default:
          data.title_invoice = 'Invoice';
          break;
      }
      const template = fs.readFileSync('templates/invoice-pdf.hbs', 'utf-8');
      handlebars.registerHelper('incremented', function (index) {
        index++;
        return index;
      });
      handlebars.registerHelper('formatCurrency', function (value) {
        if (typeof value === 'number') {
          return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(value);
        }
        return value;
      });
      handlebars.registerHelper('dateLocalFormat', function (date) {
        const months = [
          'Januari',
          'Februari',
          'Maret',
          'April',
          'Mei',
          'Juni',
          'Juli',
          'Agustus',
          'September',
          'Oktober',
          'November',
          'Desember',
        ];

        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
      });
      const compiledTemplate = handlebars.compile(template);
      const html = compiledTemplate(data);

      return html;
    } catch (error) {
      console.log(error);

      throw new AppErrorException(error);
    }
  }
}
