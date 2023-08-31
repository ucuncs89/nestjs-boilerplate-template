import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateLogSchema1689934378037 implements MigrationInterface {
  name = 'GenerateLogSchema1689934378037';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "logging"."error_log" ("id" SERIAL NOT NULL, "token" text, "path" text, "payload" text, "query" text, "message" text, "status_code" integer, "error_code" text, "user_id" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', CONSTRAINT "PK_0284e7aa7afe77ea1ce1621c252" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "logging"."error_log"`);
  }
}
