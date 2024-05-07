import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnectionService } from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { TestModule } from './modules/test/test.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { FilesModule } from './modules/files/files.module';
import { CustomersModule } from './modules/customers/customers.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { RabbitMQModule } from './rabbitmq/rabbit-mq.module';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { ErrorLogEntity } from './entities/logging/error_log.entity';
import { DepartmentsModule } from './modules/departments/departments.module';
import { FabricModule } from './modules/fabric/fabric.module';
import { AccessoriesModule } from './modules/accessories/accessories.module';
import { CategoryModule } from './modules/category/category.module';
import { ColorModule } from './modules/color/color.module';
import { RegionModule } from './modules/region/region.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MasterModule } from './modules/master/master.module';
import { PurchaseOrderModule } from './modules/purchase-order/purchase-order.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { ProjectModule } from './modules/project/project.module';
import { HomeModule } from './modules/home/home.module';

@Module({
  imports: [
    RabbitMQModule,
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnectionService,
    }),
    TypeOrmModule.forFeature([ErrorLogEntity]),
    ConfigModule.forRoot({ isGlobal: true }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      typesOutputPath: path.join(
        __dirname,
        '../src/generated/i18n.generated.ts',
      ),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    TestModule,
    AuthModule,
    RolesModule,
    UsersModule,
    ProfilesModule,
    FilesModule,
    CustomersModule,
    VendorsModule,
    ActivitiesModule,
    DepartmentsModule,
    FabricModule,
    AccessoriesModule,
    CategoryModule,
    ColorModule,
    RegionModule,
    NotificationsModule,
    MasterModule,
    PurchaseOrderModule,
    InvoiceModule,
    ProjectModule,
    HomeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  // }
}
