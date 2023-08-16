import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnectionService } from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { TestModule } from './modules/test/test.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { FilesModule } from './modules/files/files.module';
import { CustomersModule } from './modules/customers/customers.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { FabricModule } from './modules/fabric/fabric.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConnectionService,
        }),
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConnectionService,
        }),
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
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });
  });
});
