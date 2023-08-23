import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateTableCustomerNotes1692779335232
  implements MigrationInterface
{
  name = 'GenerateTableCustomerNotes1692779335232';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "customer_notes" ("id" SERIAL NOT NULL, "customer_id" integer NOT NULL, "notes" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_8a41bce1fe0094bd7a9c5266cc8" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "customer_notes"`);
  }
}
