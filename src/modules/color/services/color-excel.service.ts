import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { ColorService } from './color.service';

@Injectable()
export class ColorExcelService {
  constructor(private colorService: ColorService) {}
  async createColorExcel(payload, user_id, i18n) {
    const workbook = XLSX.read(payload.buffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    const snakeCaseData = data.map((row: Record<string, any>) => {
      return _.mapKeys(row, (value, key) => _.snakeCase(key));
    });
    for (const data of snakeCaseData) {
      if (!data.color_name) {
        continue;
      } else {
        const findByName = await this.colorService.findByName(data.color_name);
        if (!findByName) {
          await this.colorService.create(
            { name: data.color_name, color_code: data.color_code || null },
            user_id,
            i18n,
          );
        }
      }
    }
    return true;
  }
}
