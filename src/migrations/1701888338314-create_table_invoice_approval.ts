import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableInvoiceApproval1701888338314
  implements MigrationInterface
{
  name = 'CreateTableInvoiceApproval1701888338314';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "invoice_approval" ("id" SERIAL NOT NULL, "invoice_id" integer NOT NULL, "status" character varying, "status_desc" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_3f14a8f8168924520aa5e8570f5" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "invoice_approval"`);
  }
}
