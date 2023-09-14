import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';

import { Repository } from 'typeorm';
import { ActivitiesEntity } from 'src/entities/activities/activities.entity';
import { ActivitiesService } from './activities.service';
import { AppErrorException } from 'src/exceptions/app-exception';

@Injectable()
export class ActivitiesExcelService {
  constructor(private activitiesService: ActivitiesService) {}
  async createActivitiesExcel(payload, user_id, i18n) {
    const workbook = XLSX.read(payload.buffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    const snakeCaseData = data.map((row: Record<string, any>) => {
      return _.mapKeys(row, (value, key) => _.snakeCase(key));
    });
    for (const data of snakeCaseData) {
      const findByName = await this.activitiesService.findByName(
        data.activity_name,
      );
      if (findByName) {
        await this.activitiesService.update(
          findByName.id,
          { name: data.activity_name },
          user_id,
          i18n,
        );
      } else {
        await this.activitiesService.create(
          { name: data.activity_name },
          user_id,
          i18n,
        );
      }
    }
    return true;
  }
}
