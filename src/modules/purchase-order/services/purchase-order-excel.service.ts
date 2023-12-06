import { Injectable } from '@nestjs/common';
import { AppErrorException } from 'src/exceptions/app-exception';
import * as Excel from 'exceljs';

@Injectable()
export class PurchaseOrderExcelService {
  async generateExcel(data: any) {
    try {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet('Purchase Order');

      // Add data to the worksheet
      worksheet.addRow(['Purchase Order']);
      worksheet.addRow(['Number', data.code]);
      worksheet.addRow(['Status', data.status]);
      worksheet.addRow([]); // Add an empty row for spacing
      worksheet.addRow(['Origin of Shipment', '', '', 'Delivery Destination']);
      worksheet.addRow([]); // Add an empty row for spacing
      worksheet.addRow([
        'Name',
        data.company.name,
        '',
        'Name',
        data.company_name,
      ]);
      worksheet.addRow([
        'Address',
        data.company.address,
        '',
        'Address',
        data.company_address,
      ]).alignment = { wrapText: true };
      worksheet.addRow([
        'Phone',
        data.company.phone_number,
        '',
        'Phone',
        data.company_phone_number,
      ]);

      worksheet.addRow([]); // Add an empty row for spacing

      worksheet.addRow([]); // Add an empty row for spacing

      worksheet.addRow(['Cost Details']);
      // Add cost details headers

      const headerCostDetails = worksheet.addRow([
        'Number',
        'Description',
        'QTY',
        'Unit',
        'Unit Price',
        'Total',
      ]);

      // Add cost details data
      data.cost_details.forEach((detail, index) => {
        const row = worksheet.addRow([
          index + 1,
          detail.description,
          detail.quantity,
          detail.unit,
          detail.price,
          detail.total_price,
        ]);
        row.alignment = { wrapText: true };
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      });

      worksheet.addRow([]); // Add an empty row for spacing

      worksheet.addRow(['Payment']);
      worksheet.addRow(['Bank Name', data.bank_name]);
      worksheet.addRow(['Account', data.bank_account_number]);
      worksheet.addRow(['Account Holder', data.bank_account_houlders_name]);
      worksheet.addRow(['Payment Term', data.payment_term]);
      worksheet.addRow(['Delivery Date', data.delivery_date]);

      worksheet.addRow([]); // Add an empty row for spacing

      worksheet.addRow(['Total', data.total]).alignment = {
        horizontal: 'left',
      };
      worksheet.addRow([`Discount`, data.discount]).alignment = {
        horizontal: 'left',
      };
      worksheet.addRow([`PPN ${data.ppn} %`, data.ppn_result]).alignment = {
        horizontal: 'left',
      };
      worksheet.addRow([`PPH ${data.pph}`, data.pph_result]).alignment = {
        horizontal: 'left',
      };

      worksheet.addRow([`Grand Total`, data.grand_total]).alignment = {
        horizontal: 'left',
      };
      // Generate the Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;
    } catch (error) {
      throw new AppErrorException(error.message);
    }
  }
}
