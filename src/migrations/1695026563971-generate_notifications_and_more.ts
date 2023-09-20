import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateNotificationsAndMore1695026563971
  implements MigrationInterface
{
  name = 'GenerateNotificationsAndMore1695026563971';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "from_user_fullname" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "module_type" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "accessories_packaging" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "accessories_sewing" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_documents" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "fabric_vendor" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_documents" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "color" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_notes" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "departments" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "fabric" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "logging"."error_log" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "mail_templates" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_detail" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_size" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_document" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp_rate_limiter" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_otp" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_password" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_token" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_notes" ALTER COLUMN "created_at" SET DEFAULT NOW()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "module_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "from_user_fullname"`,
    );
  }
}
