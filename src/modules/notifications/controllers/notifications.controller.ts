import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import { GetListNotificationDto } from '../dto/get-list-notification.dto';
import { Pagination } from 'src/utils/pagination';
import { I18n, I18nContext } from 'nestjs-i18n';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RabbitMQService } from 'src/rabbitmq/services/rabbit-mq.service';

@ApiBearerAuth()
@ApiTags('Notifications')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @Get()
  async findAll(
    @Req() req,
    @Query() query: GetListNotificationDto,
    @I18n() i18n: I18nContext,
  ) {
    const _page = query.page || 1;
    const _page_size = query.page_size || 10;
    const data = await this.notificationsService.findAll(
      {
        page: (_page - 1) * _page_size,
        page_size: _page_size,
        sort_by: query.sort_by || 'created_at',
        order_by: query.order_by || 'DESC',
      },
      req.user.id,
      i18n,
    );
    const pagination = await Pagination.pagination(
      data.total_data,
      _page,
      _page_size,
      `/notifications`,
    );
    return { message: 'Successfully', ...data, pagination };
  }

  @Post(':id/read')
  async readNotifications(@Req() req, @Param('id') id: number) {
    this.rabbitMQService.send('update-read-notification', {
      user_id: req.user.id,
      notification_id: id,
    });
    return { data: true };
  }

  @Post('/view-all')
  async viewAllNotifications(@Req() req) {
    this.rabbitMQService.send('update-view-all-notification', {
      user_id: req.user.id,
    });
    return { data: true };
  }
}
