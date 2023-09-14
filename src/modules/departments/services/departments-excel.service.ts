import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { DepartmentsService } from './departments.service';

@Injectable()
export class DepartmentsExcelService {
  constructor(private departmentsService: DepartmentsService) {}
  async createDepartmentsExcel(payload, user_id, i18n) {
    const workbook = XLSX.read(payload.buffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    const snakeCaseData = data.map((row: Record<string, any>) => {
      return _.mapKeys(row, (value, key) => _.snakeCase(key));
    });
    for (const data of snakeCaseData) {
      const findByName = await this.departmentsService.findByName(
        data.department_name,
      );
      if (findByName) {
        await this.departmentsService.update(
          findByName.id,
          { name: data.department_name },
          user_id,
          i18n,
        );
      } else {
        await this.departmentsService.create(
          { name: data.department_name },
          user_id,
          i18n,
        );
      }
    }
    return true;
  }
}
