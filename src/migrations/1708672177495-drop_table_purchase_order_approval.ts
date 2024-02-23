import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropTablePurchaseOrderApproval1708672177495
  implements MigrationInterface
{
  name = 'DropTablePurchaseOrderApproval1708672177495';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "purchase_order_approval"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "purchase_order_approval" ("id" SERIAL NOT NULL, "purchase_order_id" integer NOT NULL, "status" character varying, "status_desc" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_0c7bac7936e9a8d8205ece95fb8" PRIMARY KEY ("id"))`,
    );
  }
}
