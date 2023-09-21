import { Injectable } from '@nestjs/common';
import { GetListNotificationDto } from '../dto/get-list-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationsEntity } from 'src/entities/master/notifications.entity';
import { IsNull, Repository } from 'typeorm';
import { isNull } from 'lodash';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationsEntity)
    private notificationsRepository: Repository<NotificationsEntity>,
  ) {}
  async findAll(query: GetListNotificationDto, user_id, i18n) {
    const { page, page_size, sort_by, order_by } = query;
    let orderObj = {};
    switch (sort_by) {
      case 'created_at':
        orderObj = {
          id: order_by,
        };
        break;
    }
    const count_view = await this.notificationsRepository.count({
      where: { deleted_at: IsNull(), to_user_id: user_id, is_view: false },
    });
    const [result, total] = await this.notificationsRepository.findAndCount({
      select: {
        id: true,
        from_user_id: true,
        to_user_id: true,
        is_read: true,
        message: true,
        created_at: true,
        created_by: true,
        from_user_fullname: true,
        module_type: true,
        is_view: true,
      },
      where: {
        deleted_at: IsNull(),
        to_user_id: user_id,
      },
      order: orderObj,
      take: page_size,
      skip: page,
    });
    return {
      data: result,
      total_data: total,
      count_view,
    };
  }
}
