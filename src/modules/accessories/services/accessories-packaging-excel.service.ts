import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { AccessoriesPackagingService } from './accessories-packaging.service';

@Injectable()
export class AccessoriesExcelPackagingService {
  constructor(
    private accessoriesPackagingService: AccessoriesPackagingService,
  ) {}
  async createAccessoriesPackagingExcel(payload, user_id, i18n) {
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
        const findByName = await this.accessoriesPackagingService.findByName(
          data.accessories_name,
        );
        if (!findByName) {
          const payloadPackaging = {
            name: data.accessories_name,
            category: data.category ? data.category.split(',') : null,
          };
          await this.accessoriesPackagingService.create(
            payloadPackaging,
            user_id,
            i18n,
          );
        }
      }
    }
    return true;
  }
}
