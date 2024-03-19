import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { AppErrorException } from 'src/exceptions/app-exception';

@Injectable()
export class ProjectProductionShippingPdfService {
  async generatePdf(data: any) {
    const grand_total = data?.detail?.reduce(
      (acc, item) => acc + parseInt(item.total_item),
      0,
    );
    try {
      const template = fs.readFileSync(
        'templates/delivery-note-pdf.hbs',
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
      const html = compiledTemplate({ ...data, grand_total });

      return html;
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
