import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { AccessoriesSewingService } from './accessories-sewing.service';

@Injectable()
export class AccessoriesSewingExcelService {
  constructor(private accessoriesSewingService: AccessoriesSewingService) {}
  async createAccessoriesSewingExcel(payload, user_id, i18n) {
    const workbook = XLSX.read(payload.buffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    const snakeCaseData = data.map((row: Record<string, any>) => {
      return _.mapKeys(row, (value, key) => _.snakeCase(key));
    });
    for (const data of snakeCaseData) {
      if (!data.accessories_name) {
        continue;
      } else {
        const payloadSewing = {
          name: data.accessories_name,
          category: data.category ? data.category.split(',') : null,
          unit_of_measure: data.unit_of_measure
            ? data.unit_of_measure.split(',')
            : null,
        };
        const findByName = await this.accessoriesSewingService.findByName(
          data.accessories_name,
        );
        if (!findByName) {
          await this.accessoriesSewingService.create(
            payloadSewing,
            user_id,
            i18n,
          );
        } else {
          await this.accessoriesSewingService.update(
            findByName.id,
            payloadSewing,
            user_id,
            i18n,
          );
        }
      }
    }
    return true;
  }
}
