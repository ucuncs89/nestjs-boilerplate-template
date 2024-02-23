import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablePurchaseOrderStatus1708673019982
  implements MigrationInterface
{
  name = 'CreateTablePurchaseOrderStatus1708673019982';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "purchase_order_status" ("id" SERIAL NOT NULL, "purchase_order_id" integer NOT NULL, "status" character varying, "status_desc" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "deleted_by" integer, CONSTRAINT "PK_574b66f87fa8eabca9733550353" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "purchase_order_status"`);
  }
}
