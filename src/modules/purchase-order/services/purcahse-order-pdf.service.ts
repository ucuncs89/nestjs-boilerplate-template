import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { AppErrorException } from 'src/exceptions/app-exception';

@Injectable()
export class PurchaseOrderPdfService {
  async generatePdf(data: any) {
    try {
      const template = fs.readFileSync(
        'templates/purchase-order-pdf.hbs',
        'utf-8',
      );
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
      const compiledTemplate = handlebars.compile(template);
      const html = compiledTemplate(data);

      return html;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
