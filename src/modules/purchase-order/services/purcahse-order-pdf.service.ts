import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import { AppErrorException } from 'src/exceptions/app-exception';

@Injectable()
export class PurchaseOrderPdfService {
  async generatePdf(data: any) {
    try {
      const browser = await puppeteer.launch({
        args: [
          // Required for Docker version of Puppeteer
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--no-zygote',
          '--single-process',
          // This will write shared memory files into /tmp instead of /dev/shm,
          // because Docker’s default for /dev/shm is 64MB
          '--disable-dev-shm-usage',
        ],
      });
      const page = await browser.newPage();

      const template = fs.readFileSync('templates/example.hbs', 'utf-8');
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
      await page.setContent(html, {
        waitUntil: 'load',
      });
      page.on('console', (consoleObj) => console.log(consoleObj.text()));
      await page.emulateMediaType('print');

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
          left: '10mm',
        },
        landscape: true,
      });

      await browser.close();
      return pdfBuffer;
    } catch (error) {
      console.log(error);

      throw new AppErrorException(error);
    }
  }
}
