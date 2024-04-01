import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { FabricService } from './fabric.service';

@Injectable()
export class FabricExcelService {
  constructor(private fabricService: FabricService) {}
  async createFabricExcel(payload, user_id, i18n) {
    const workbook = XLSX.read(payload.buffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    const snakeCaseData = data.map((row: Record<string, any>) => {
      return _.mapKeys(row, (value, key) => _.snakeCase(key));
    });
    for (const data of snakeCaseData) {
      if (!data.fabric_name) {
        continue;
      } else {
        const findByName = await this.fabricService.findByName(
          data.fabric_name,
        );
        if (!findByName) {
          const payloadFabric = {
            name: data.fabric_name,
            category: data.category ? data.category.split(',') : null,
            unit_of_measure: data.unit_of_measure
              ? data.unit_of_measure.split(',')
              : null,
          };
          await this.fabricService.create(payloadFabric, user_id, i18n);
        }
      }
    }
    return true;
  }
}
