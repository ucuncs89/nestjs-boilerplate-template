import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserDetailAndNotifications1687146819152
  implements MigrationInterface
{
  name = 'CreateUserDetailAndNotifications1687146819152';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_detail" ("user_id" integer NOT NULL, "login_at" TIMESTAMP WITH TIME ZONE, "logout_at" TIMESTAMP WITH TIME ZONE, "expired_token" TIMESTAMP WITH TIME ZONE, "password_rate_limiter" integer, "suspend_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_aebc3bfe11ea329ed91cd8c5759" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, "id" SERIAL NOT NULL, "from_user_id" integer NOT NULL, "to_user_id" integer NOT NULL, "message" text NOT NULL, "is_read" boolean NOT NULL, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "user_detail"`);
  }
}
